import { Injectable } from "@angular/core";
import { Coin } from "../../models/coin/coin";
import SockJS from "sockjs-client";
import { Client, IFrame, IStompSocket, Stomp } from "@stomp/stompjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, interval, map, catchError, of } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CryptocurrencyService {
  private externalApi = "https://api.alternative.me/v2/ticker";
  private backendApi = "influxdb/";

  private _selectedToken!: string;
  private tokenSlugMapping: Record<string, string> = {
    BTCUSDT: "bitcoin",
    ETHUSDT: "ethereum",
    BNBUSDT: "binancecoin",
    SOLUSDT: "solana",
    AVAXUSDT: "avalanche-2",
    XRPUSDT: "ripple",
    ADAUSDT: "cardano",
    DOGEUSDT: "dogecoin",
    DOTUSDT: "polkadot",
    SHIBUSDT: "shiba-inu",
  };
  private _tokens = Object.keys(this.tokenSlugMapping);
  private _coinData: Record<string, Coin> = {}; // Cache to hold the latest data for each token

  private supplyData: Record<
    string,
    { circulatingSupply: number; maxSupply: number }
  > = {}; // Cache to hold supply data

  private stompClient: Client;

  constructor(private http: HttpClient) {
    this.backendApi = environment.apiUrl + this.backendApi;
    this.stompClient = new Client();

    this.stompClient.webSocketFactory = (): IStompSocket => {
      // return new SockJS(
      //   "http://localhost:8080/sockjs-websocket"
      // ) as IStompSocket;
      return new SockJS("/backend/sockjs-websocket") as IStompSocket;
    };

    this.stompClient.onConnect = (frame: IFrame) => {
      this.stompClient.subscribe("/topic/messages", (message) => {
        this.handleMessage(message.body);
      });
    };

    this.stompClient.onStompError = (frame: IFrame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    this.connect();

    // Update supply data every hour
    this.updateSupplyData();
    setInterval(() => {
      this.updateSupplyData();
    }, 1 * 60 * 1000); // Every minute
  }

  getCoinData(token: string): {
    coin: Coin;
    additionalData: { circulatingSupply: number; maxSupply: number };
  } | null {
    const coin = this.coinData[token]; // Use cached coin data
    const additionalData = this.supplyData[token]; // Use cached supply data

    if (coin && additionalData) {
      return { coin, additionalData };
    }

    console.error(`Data for token ${token} not found.`);
    return null; // Return null if data is not available
  }

  getCoinStream(token: string): Observable<{
    coin: Coin;
    additionalData: { circulatingSupply: number; maxSupply: number };
  }> {
    return interval(1000).pipe(
      map(() => ({
        coin: this._coinData[token], // Use cached coin data
        additionalData: this.supplyData[token], // Use cached supply data
      }))
    );
  }

  getAllCoinsStream(): Observable<Coin[]> {
    return interval(1000).pipe(
      map(() => Object.values(this._coinData)) // Return the latest data for all tokens
    );
  }

  private updateSupplyData(): void {
    this._tokens.forEach((token) => {
      const slug = this.tokenSlugMapping[token];
      this.fetchSupplyData(slug).subscribe(
        (data) => {
          this.supplyData[token] = data; // Cache the supply data
        },
        (error) => {
          console.error(`Error fetching supply data for ${token}:`, error);
        }
      );
    });
  }

  private fetchSupplyData(slug: string): Observable<{
    circulatingSupply: number;
    maxSupply: number;
  }> {
    const url = `${this.externalApi}/${slug}/`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const coinData = response?.data?.[Object.keys(response.data)[0]];
        if (!coinData) {
          return { circulatingSupply: 0, maxSupply: 0 }; // Default values if API fails
        }
        return {
          circulatingSupply: coinData.circulating_supply || 0,
          maxSupply: coinData.max_supply || 0,
        };
      }),
      catchError(() => of({ circulatingSupply: 0, maxSupply: 0 })) // Handle errors gracefully
    );
  }

  connect(): void {
    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  private handleMessage(message: string): void {
    try {
      const json = JSON.parse(message); // Parse the JSON string
      const coin = this.mapToCoin(json); // Map it to a Coin instance
      this._coinData[coin.token] = coin;
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  private mapToCoin(data: any): Coin {
    return {
      token: data.token,
      startTime: data.start_time,
      endTime: data.end_time,
      openPrice: parseFloat(data.open_price),
      closePrice: parseFloat(data.close_price),
      highestPrice: parseFloat(data.highest_price),
      lowestPrice: parseFloat(data.lowest_price),
      volume: parseFloat(data.volume),
      trades: data.trades,
    } as Coin;
  }

  public findAllTokenData(token: string): Observable<Array<Coin>> {
    const params = new HttpParams()
      .set("token", token)
      .set("startTime", "2000-01-01T00:00:00Z")
      .set("endTime", "2100-01-01T00:00:00Z");
    return this.http.get<Array<Coin>>(
      this.backendApi + "findByTokenAndTimeRange",
      { params }
    );
  }

  getLastTwoPeriods(): Observable<
    Record<string, { trades: number; volume: number }>
  > {
    const url = `${this.backendApi}getLastTwoPeriods`;

    const params = new HttpParams()
      .set("startTime", "2000-01-01T00:00:00Z")
      .set("stopTime", "2100-01-01T00:00:00Z")
      .set("windowPeriod", "1h");

    return this.http.get<Record<string, { trades: number; volume: number }>>(
      url,
      { params }
    );
  }

  getLastTwoPeriodsForToken(token: string): Observable<Record<string, number>> {
    const url = `${this.backendApi}getLastTwoPeriodsForToken`;
    const params = new HttpParams()
      .set("token", token)
      .set("startTime", "2000-01-01T00:00:00Z")
      .set("stopTime", "2100-01-01T00:00:00Z")
      .set("windowPeriod", "1h");

    return this.http.get<Record<string, number>>(url, { params });
  }

  getMci(token: string): Observable<Map<string, any>[]> {
    const params = new HttpParams().set("token", token);

    return this.http.get<Map<string, any>[]>(`${environment.apiUrl}mci`, {
      params,
    });
  }

  public get selectedToken(): string {
    return this._selectedToken;
  }
  public set selectedToken(value: string) {
    this._selectedToken = value;
  }

  public get tokens() {
    return this._tokens;
  }
  public set tokens(value) {
    this._tokens = value;
  }

  public get coinData(): Record<string, Coin> {
    return this._coinData;
  }
  public set coinData(value: Record<string, Coin>) {
    this._coinData = value;
  }
}

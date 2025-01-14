import { Injectable } from "@angular/core";
import { Coin } from "../../models/coin/coin";
import { interval, Observable, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CryptocurrencySimulationService {
  private tokenSlugMapping: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    SOL: "solana",
    AVAX: "avalanche-2",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    DOT: "polkadot",
    SHIB: "shiba-inu",
  };

  private tokens = Object.keys(this.tokenSlugMapping);

  private coinData: Record<string, Coin> = {}; // Cache to hold the latest data for each token
  private supplyData: Record<
    string,
    { circulatingSupply: number; maxSupply: number }
  > = {}; // Cache to hold supply data

  private apiUrl = "https://api.alternative.me/v2/ticker";

  constructor(private http: HttpClient) {
    // Initialize the coin data cache
    this.tokens.forEach((token) => {
      this.coinData[token] = this.generateRandomCoinData(token);
      this.supplyData[token] = { circulatingSupply: 0, maxSupply: 0 }; // Default values
    });

    // Simulate real-time updates every second for coin data
    interval(1000).subscribe(() => {
      this.tokens.forEach((token) => {
        this.coinData[token] = this.generateRandomCoinData(token);
      });
    });

    // Update supply data every hour
    this.updateSupplyData();
    setInterval(() => {
      this.updateSupplyData();
    }, 60 * 60 * 1000); // Every hour
  }

  getCoinStream(token: string): Observable<{
    coin: Coin;
    additionalData: { circulatingSupply: number; maxSupply: number };
  }> {
    return interval(1000).pipe(
      map(() => ({
        coin: this.coinData[token], // Use cached coin data
        additionalData: this.supplyData[token], // Use cached supply data
      }))
    );
  }

  getAllCoinsStream(): Observable<Coin[]> {
    return interval(1000).pipe(
      map(() => Object.values(this.coinData)) // Return the latest data for all tokens
    );
  }

  private updateSupplyData(): void {
    this.tokens.forEach((token) => {
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
    const url = `${this.apiUrl}/${slug}/`;
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

  private generateRandomCoinData(token: string): Coin {
    const startTime = Math.floor(Date.now() / 1000); // Current time in epoch (seconds)
    const endTime = startTime + 60; // 1 minute later in epoch
    const openPrice = this.getRandomNumber(1000, 50000);
    const closePrice = this.getRandomNumber(1000, 50000);
    const highestPrice = Math.max(
      openPrice,
      closePrice,
      this.getRandomNumber(1000, 50000)
    );
    const lowestPrice = Math.min(
      openPrice,
      closePrice,
      this.getRandomNumber(1000, 50000)
    );
    const volume = this.getRandomNumber(1000, 1000000);
    const trades = Math.floor(this.getRandomNumber(10, 1000));

    return {
      token,
      endTime,
      openPrice,
      closePrice,
      highestPrice,
      lowestPrice,
      volume,
      trades,
      startTime,
    };
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

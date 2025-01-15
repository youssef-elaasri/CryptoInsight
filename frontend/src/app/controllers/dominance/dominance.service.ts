import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DominanceService {
  private apiUrl = "/api/v2/global/";

  private _totalMarketCap: number | null = null;

  constructor(private http: HttpClient) {
    this.fetchAndSetMarketCap();

    interval(60 * 60 * 1000).subscribe(() => {
      // Every hour
      this.fetchAndSetMarketCap();
    });
  }

  private fetchAndSetMarketCap(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        this._totalMarketCap =
          response?.data?.quotes?.USD?.total_market_cap || null;
        console.log(this._totalMarketCap);
      },
      (error) => {
        console.error("Error fetching total market cap:", error);
        this._totalMarketCap = null;
      }
    );
  }
  public get totalMarketCap(): number | null {
    return this._totalMarketCap;
  }
}

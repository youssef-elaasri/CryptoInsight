import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DominanceService {
  private apiUrl = "/api/v2/global/";

  private _totalMarketCap: number | null = null;

  _refresh!: number;

  constructor(private http: HttpClient) {
    this.fetchAndSetMarketCap();

    interval(1 * 60 * 1000).subscribe(() => {
      // Every minute
      this.fetchAndSetMarketCap();
    });
  }

  public fetchAndSetMarketCap() {
    return this.http.get<any>(this.apiUrl);
  }
  //response?.data?.quotes?.USD?.total_market_cap || null;
  public get totalMarketCap(): number | null {
    return this._totalMarketCap;
  }

  public get refresh(): number {
    return this._refresh;
  }
  public set refresh(value: number) {
    this._refresh = value;
  }
}

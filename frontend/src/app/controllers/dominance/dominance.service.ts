import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DominanceService {
  constructor(private http: HttpClient) {
    this.fetchAndSetMarketCap();

    interval(1 * 60 * 1000).subscribe(() => {
      // Every minute
      this.fetchAndSetMarketCap();
    });
  }

  fetchAndSetMarketCap(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "external");
  }
}

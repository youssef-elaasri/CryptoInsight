import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CfgiService {
  private apiUrl = "https://api.alternative.me/fng/?limit=31&format=json";

  private refreshInterval: any;

  private _todayData: { value: number | null; classification: string | null } =
    {
      value: null,
      classification: null,
    };

  private _yesterdayData: {
    value: number | null;
    classification: string | null;
  } = {
    value: null,
    classification: null,
  };

  private _lastWeekData: {
    value: number | null;
    classification: string | null;
  } = {
    value: null,
    classification: null,
  };

  private _lastMonthData: {
    value: number | null;
    classification: string | null;
  } = {
    value: null,
    classification: null,
  };

  constructor(private http: HttpClient) {
    this.fetchAndSetData();
    this.refreshInterval = setInterval(() => {
      this.fetchAndSetData();
    }, 60 * 60 * 1000); // update every hour
  }

  fetchAndSetData(): void {
    this.getFearGreedIndex().subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          // Extract and store data for today, yesterday, last week, and last month
          this._todayData = {
            value: parseInt(response.data[0]?.value, 10) || null,
            classification: response.data[0]?.value_classification || null,
          };
          this._yesterdayData = {
            value: parseInt(response.data[1]?.value, 10) || null,
            classification: response.data[1]?.value_classification || null,
          };
          this._lastWeekData = {
            value: parseInt(response.data[7]?.value, 10) || null,
            classification: response.data[7]?.value_classification || null,
          };
          this._lastMonthData = {
            value: parseInt(response.data[30]?.value, 10) || null,
            classification: response.data[30]?.value_classification || null,
          };
        }
      },
      (error) => {
        console.error("Error fetching Fear and Greed Index:", error);
      }
    );
  }

  getFearGreedIndex(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  public get todayData(): {
    value: number | null;
    classification: string | null;
  } {
    return this._todayData;
  }
  public set todayData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this._todayData = value;
  }
  public get yesterdayData(): {
    value: number | null;
    classification: string | null;
  } {
    return this._yesterdayData;
  }
  public set yesterdayData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this._yesterdayData = value;
  }
  public get lastWeekData(): {
    value: number | null;
    classification: string | null;
  } {
    return this._lastWeekData;
  }
  public set lastWeekData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this._lastWeekData = value;
  }
  public get lastMonthData(): {
    value: number | null;
    classification: string | null;
  } {
    return this._lastMonthData;
  }
  public set lastMonthData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this._lastMonthData = value;
  }
}

import { Injectable } from "@angular/core";
import { Coin } from "../../models/coin/coin";
import { filter, interval, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CoinSimulationService {
  private tokens = [
    "BTC",
    "ETH",
    "BNB",
    "SOL",
    "AVAX",
    "XRP",
    "ADA",
    "DOGE",
    "DOT",
    "SHIB",
  ]; // Example tokens
  private coinData: Record<string, Coin> = {}; // Cache to hold the latest data for each token

  constructor() {
    // Initialize the coin data cache
    this.tokens.forEach((token) => {
      this.coinData[token] = this.generateRandomCoinData(token);
    });

    // Simulate real-time updates every second
    interval(1000).subscribe(() => {
      this.tokens.forEach((token) => {
        this.coinData[token] = this.generateRandomCoinData(token);
      });
    });
  }

  /**
   * Observable to get updates for a specific coin.
   */
  getCoinStream(token: string): Observable<Coin> {
    return interval(1000).pipe(
      map(() => this.coinData[token]), // Return the latest data for the requested token
      filter((coin) => !!coin) // Ensure the coin exists
    );
  }

  /**
   * Observable to get updates for all coins.
   */
  getAllCoinsStream(): Observable<Coin[]> {
    return interval(1000).pipe(
      map(() => Object.values(this.coinData)) // Return the latest data for all tokens
    );
  }

  /**
   * Helper method to generate random coin data.
   */
  private generateRandomCoinData(token: string): Coin {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60000); // 1 minute later
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

  /**
   * Helper method to generate random numbers.
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

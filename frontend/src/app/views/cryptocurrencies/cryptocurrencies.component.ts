import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Coin } from "../../models/coin/coin";
import { ButtonModule } from "primeng/button";
import { CryptocurrencyService } from "../../controllers/cryptocurrency/cryptocurrency.service";
import { Router } from "@angular/router";

interface TokenData {
  volume: number;
  close_price: number;
  trades: number;
}

type TokenDictionary = Record<string, TokenData>;

@Component({
  selector: "app-cryptocurrencies",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
  ],
  templateUrl: "./cryptocurrencies.component.html",
  styleUrl: "./cryptocurrencies.component.css",
})
export class CryptocurrenciesComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private cryptocurrencyService: CryptocurrencyService
  ) {}

  coins: Coin[] = [];
  loading: boolean = true;

  changePercentages: Record<string, number> = {};

  previousCoins!: TokenDictionary;
  private updateInterval: any;

  topGainers: {
    token: string;
    changePercentage: number;
    closePrice: number;
  }[] = [];
  topLosers: { token: string; changePercentage: number; closePrice: number }[] =
    [];
  topChange: { token: string; changePercentage: number; closePrice: number }[] =
    [];

  ngOnInit() {
    console.log("HELLOOOOOOOOOOOOOOOOOO :>> ", "HELLOOOOOOOOOOOOOOOOOO");
    this.cryptocurrencyService.getLastTwoPeriods().subscribe((data) => {
      this.previousCoins = data as TokenDictionary;
    });
    this.cryptocurrencyService.getAllCoinsStream().subscribe((coins) => {
      console.log(coins);
      this.coins = coins;
      this.calculateTopChanges();
      this.loading = false;
      this.coins = this.coins.sort((a, b) => b.closePrice - a.closePrice);
    });
    this.updateInterval = setInterval(() => {
      this.cryptocurrencyService.getLastTwoPeriods().subscribe((data) => {
        this.previousCoins = data as TokenDictionary;
      });
    }, 1 * 60 * 1000); // Every minute
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  calculateTopChanges() {
    // Calculate change percentage for each token
    Object.entries(this.previousCoins).forEach(([token, previousCoin]) => {
      // Find the matching coin in the coins array
      const currentCoin = this.coins.find((coin) => coin.token === token);

      if (!currentCoin) {
        console.warn(`No current coin found for token: ${token}`);
        return;
      }

      const currentClosePrice = currentCoin.closePrice; // Get current close price
      const previousClosePrice = previousCoin.close_price || 0; // Get previous close price

      const changePercentage =
        previousClosePrice !== 0
          ? ((currentClosePrice - previousClosePrice) / previousClosePrice) *
            100
          : 0;

      // Store in dictionary
      this.changePercentages[token] = changePercentage;
    });

    // Convert the dictionary to an array for sorting
    const changes = Object.entries(this.changePercentages).map(
      ([token, changePercentage]) => {
        const currentCoin = this.coins.find((coin) => coin.token === token);
        return {
          token,
          changePercentage,
          closePrice: currentCoin?.closePrice || 0,
        };
      }
    );

    // Sort by gainers (highest changePercentage first)
    const sortedByGain = [...changes].sort(
      (a, b) => b.changePercentage - a.changePercentage
    );

    // Sort by losers (lowest changePercentage first)
    const sortedByLoss = [...changes].sort(
      (a, b) => a.changePercentage - b.changePercentage
    );

    // Sort by absolute change (largest absolute changePercentage first)
    const sortedByAbsoluteChange = [...changes].sort(
      (a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage)
    );

    // Extract the top 3 for each category
    this.topGainers = sortedByGain.slice(0, 3);
    this.topLosers = sortedByLoss.slice(0, 3);
    this.topChange = sortedByAbsoluteChange.slice(0, 3);
  }

  format(value: number): string {
    if (!value || isNaN(value)) {
      return "N/A";
    }

    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + "T"; // Trillions
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + "B"; // Billions
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + "M"; // Millions
    } else {
      return value.toFixed(2); // Less than a million
    }
  }

  positiveChange(token: string) {
    if (this.changePercentages[token] >= 0) return true;
    return false;
  }

  getIcon(token: string): string {
    token = token.replace("USDT", "").toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }

  viewCoin(token: string) {
    this.cryptocurrencyService.selectedToken = token;
    this.router.navigate(["cryptocurrency"]);
  }

  removeUSDT(input: string): string {
    return input.endsWith("USDT") ? input.slice(0, -4) : input;
  }

  connect() {
    this.cryptocurrencyService.connect();
  }

  disconnect() {
    this.cryptocurrencyService.disconnect();
  }
}

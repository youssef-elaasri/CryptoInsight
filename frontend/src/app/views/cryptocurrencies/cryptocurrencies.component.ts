import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Coin } from "../../models/coin/coin";
import { ButtonModule } from "primeng/button";
import { CryptocurrencySimulationService } from "../../controllers/cryptocurrency-simulation/cryptocurrency-simulation.service";
import { CryptocurrencyService } from "../../controllers/cryptocurrency/cryptocurrency.service";
import { Router } from "@angular/router";

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
export class CryptocurrenciesComponent implements OnInit {
  constructor(
    private router: Router,
    private cryptocurrencyService: CryptocurrencyService,
    private cryptocurrencySimulationService: CryptocurrencySimulationService
  ) {}

  coins: Coin[] = [];
  previousCoins: {
    [token: string]: { changePercentage: number; previousClosePrice: number };
  } = {};
  loading: boolean = true;

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
    this.cryptocurrencySimulationService
      .getAllCoinsStream()
      .subscribe((coins) => {
        const updatedPreviousCoins: {
          [token: string]: {
            changePercentage: number;
            previousClosePrice: number;
          };
        } = {};
        coins.forEach((coin) => {
          const previousCoin = this.previousCoins[coin.token];
          updatedPreviousCoins[coin.token] = {
            changePercentage: previousCoin
              ? ((coin.closePrice - previousCoin.previousClosePrice) /
                  previousCoin.previousClosePrice) *
                100
              : 0,
            previousClosePrice: coin.closePrice,
          };
        });
        this.previousCoins = updatedPreviousCoins;
        this.coins = coins;
        this.calculateTopChanges();
        this.loading = false;
        // this.coins = this.coins.sort((a, b) => b.closePrice - a.closePrice);
      });
  }

  calculateTopChanges() {
    const changes = Object.entries(this.previousCoins).map(([token, data]) => ({
      token,
      changePercentage: data.changePercentage,
      closePrice: data.previousClosePrice,
    }));

    const sortedByGain = [...changes].sort(
      (a, b) => b.changePercentage - a.changePercentage
    );

    const sortedByLoss = [...changes].sort(
      (a, b) => a.changePercentage - b.changePercentage
    );

    const sortedByAbsoluteChange = [...changes].sort(
      (a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage)
    );

    this.topGainers = sortedByGain.slice(0, 3);
    this.topLosers = sortedByLoss.slice(0, 3);
    this.topChange = sortedByAbsoluteChange.slice(0, 3);
  }

  positiveChange(token: string) {
    if (this.previousCoins[token].changePercentage >= 0) return true;
    return false;
  }

  getIcon(token: string): string {
    token = token.toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }

  viewCoin(token: string) {
    this.cryptocurrencyService.selectedToken = token;
    this.router.navigate(["cryptocurrency"]);
  }
}

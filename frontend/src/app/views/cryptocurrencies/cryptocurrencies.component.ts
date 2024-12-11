import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Coin } from "../../models/coin/coin";
import { ButtonModule } from "primeng/button";
import { CoinSimulationService } from "../../controllers/coin-simulation-service/coin-simulation-service.service";

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
  constructor(private coinSimulationService: CoinSimulationService) {}

  coins: Coin[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.coinSimulationService.getAllCoinsStream().subscribe((coins) => {
      this.coins = coins;
      // this.coins = this.coins.sort((a, b) => b.closePrice - a.closePrice);
    });
  }

  getIcon(token: string): string {
    token = token.toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }
}

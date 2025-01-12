import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { CryptocurrencyService } from "../../controllers/cryptocurrency/cryptocurrency.service";
import { Coin } from "../../models/coin/coin";
import { CryptocurrencySimulationService } from "../../controllers/cryptocurrency-simulation/cryptocurrency-simulation.service";

interface CoinData {
  data: string;
  value: string;
}

@Component({
  selector: "app-cryptocurrency",
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: "./cryptocurrency.component.html",
  styleUrl: "./cryptocurrency.component.css",
})
export class CryptocurrencyComponent implements OnInit {
  coin: Coin = new Coin();
  coinData!: CoinData[];

  constructor(
    private cryptocurrencyService: CryptocurrencyService,
    private cryptocurrencySimulationService: CryptocurrencySimulationService
  ) {}

  ngOnInit(): void {
    // this.cryptocurrencySimulationService
    //   .getCoinStream(this.cryptocurrencyService.selectedToken)
    //   .subscribe((coin) => {
    //     this.coin = coin;
    //   });
    this.cryptocurrencySimulationService
      .getCoinStream("BTC")
      .subscribe((coin) => {
        this.coin = coin;
        this.coinData = [
          { data: "volume", value: this.coin.volume.toString() },
          { data: "trades", value: this.coin.trades.toString() },
        ];
      });
  }

  getIcon(token: string): string {
    if (token === undefined) return token;
    token = token.toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }
}

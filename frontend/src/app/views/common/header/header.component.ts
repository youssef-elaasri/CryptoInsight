import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DominanceService } from "../../../controllers/dominance/dominance.service";
import { CryptocurrencyService } from "../../../controllers/cryptocurrency/cryptocurrency.service";
import { Coin } from "../../../models/coin/coin";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  isLoading = false;
  constructor(
    private router: Router,
    private dominanceService: DominanceService,
    private cryptocurrencyService: CryptocurrencyService
  ) {}

  redirectToCfgi() {
    this.isLoading = false;
    this.router.navigate(["cfgi"]);
  }

  redirectToDominance() {
    let size = Object.keys(this.cryptocurrencyService.coinData).length;
    if (size !== 10) this.isLoading = true;
    else {
      this.isLoading = false;
      this.dominanceService.refresh = 5;
      this.router.navigate(["dominance"]);
    }
  }
}

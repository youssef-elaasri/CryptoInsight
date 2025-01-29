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
  constructor(private router: Router) {}
}

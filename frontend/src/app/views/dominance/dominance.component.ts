import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { CardModule } from "primeng/card";

import { ChartModule } from "primeng/chart";
import { CryptocurrencySimulationService } from "../../controllers/cryptocurrency-simulation/cryptocurrency-simulation.service";
import { DominanceService } from "../../controllers/dominance/dominance.service";
import { ButtonModule } from "primeng/button";
import { CryptocurrencyService } from "../../controllers/cryptocurrency/cryptocurrency.service";
import { Router } from "@angular/router";
import { interval, filter, take } from "rxjs";

@Component({
  selector: "app-dominance",
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule],
  templateUrl: "./dominance.component.html",
  styleUrl: "./dominance.component.css",
})
export class DominanceComponent implements OnInit, OnDestroy {
  data: any;
  options: any;
  tokens: any;
  marketCaps: number[] = [];
  platformId = inject(PLATFORM_ID);
  private updateInterval: any;
  loading: boolean = true;

  visualType: boolean = true; // true => chart | false => pie

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private dominanceService: DominanceService,
    private cryptocurrencyService: CryptocurrencyService
  ) {}

  ngOnInit() {
    this.tokens = this.cryptocurrencyService.tokens;
    this.tokens = [...this.tokens, "Others"];
    if (Object.keys(this.cryptocurrencyService.coinData).length !== 10) {
      this.cryptocurrencyService.connect();

      // Poll until coinData length becomes 10
      interval(200) // Poll every 200ms
        .pipe(
          filter(
            () => Object.keys(this.cryptocurrencyService.coinData).length === 10
          ), // Check length
          take(1) // Complete after the condition is met
        )
        .subscribe(() => {
          this.cryptocurrencyService.disconnect();
          // Proceed to the next steps
          this.calculateDominance();
          this.loading = false;
          this.updateInterval = setInterval(() => {
            this.calculateDominance();
          }, 1 * 60 * 1000); // Every minute
        });
    } else {
      this.loading = false;
      // If already ready, proceed directly
      this.calculateDominance();
      this.updateInterval = setInterval(() => {
        this.calculateDominance();
      }, 1 * 60 * 1000); // Every minute
    }
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  switchType(type: boolean) {
    if ((type && this.visualType) || (!type && !this.visualType)) return;
    this.visualType = !this.visualType;
    if (this.visualType) {
      this.initChart();
    } else {
      this.initPie();
    }
  }

  //
  calculateDominance(): void {
    this.dominanceService.fetchAndSetMarketCap().subscribe((response) => {
      const totalMarketCap =
        response?.data?.quotes?.USD?.total_market_cap || null;
      // const totalMarketCap = 3210453463579;

      // Check if totalMarketCap is valid
      if (!totalMarketCap || totalMarketCap <= 0) {
        console.error("Total market cap is invalid or null.");
        return;
      }

      // Calculate market caps for tokens except the last one ("Others")
      this.marketCaps = this.tokens.slice(0, -1).map((token: any) => {
        const coinData = this.cryptocurrencyService.getCoinData(token);

        // Safely calculate market cap with fallback values
        const marketCap =
          (coinData?.coin?.closePrice || 0) *
          (coinData?.additionalData?.circulatingSupply || 0);

        return marketCap;
      });

      // Calculate total market cap for calculated tokens
      const totalCalculatedMarketCap = this.marketCaps.reduce(
        (a, b) => a + b,
        0
      );

      // Calculate "Others" market cap
      const othersMarketCap = totalMarketCap - totalCalculatedMarketCap;

      // Add "Others" market cap as the last value in the array
      this.marketCaps.push(
        othersMarketCap > 0 ? othersMarketCap : 50000000000000
      );

      // Convert market caps to dominance percentages
      this.marketCaps = this.marketCaps.map((cap) =>
        Number(((cap / totalMarketCap) * 100).toFixed(2))
      );

      // work around
      this.visualType = !this.visualType;
      if (this.visualType) {
        this.initChart();
      } else {
        this.initPie();
      }

      this.visualType = !this.visualType;
      if (this.visualType) {
        this.initChart();
      } else {
        this.initPie();
      }

      if (this.visualType) this.initChart;
      else this.initPie;
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--p-text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--p-text-muted-color"
      );
      const surfaceBorder = "#EDEDED";

      this.data = {
        labels: this.getTokensWithoutUSDT(),
        datasets: [
          {
            data: this.marketCaps,
            backgroundColor: [
              "rgba(249, 115, 22, 0.6)", // Darker Orange
              "rgba(6, 182, 212, 0.6)", // Darker Cyan
              "rgba(107, 114, 128, 0.6)", // Darker Gray
              "rgba(139, 92, 246, 0.6)", // Darker Purple
              "rgba(34, 197, 94, 0.6)", // Darker Green
              "rgba(239, 68, 68, 0.6)", // Darker Red
              "rgba(59, 130, 246, 0.6)", // Darker Blue
              "rgba(250, 204, 21, 0.6)", // Darker Yellow
              "rgba(217, 70, 239, 0.6)", // Darker Pink
              "rgba(16, 185, 129, 0.6)", // Darker Teal
              "rgba(37, 99, 235, 0.6)", // Darker Indigo
            ],
            borderColor: [
              "rgb(249, 115, 22)", // Orange
              "rgb(6, 182, 212)", // Cyan
              "rgb(107, 114, 128)", // Gray
              "rgb(139, 92, 246)", // Purple
              "rgb(34, 197, 94)", // Green
              "rgb(239, 68, 68)", // Red
              "rgb(59, 130, 246)", // Blue
              "rgb(250, 204, 21)", // Yellow
              "rgb(217, 70, 239)", // Pink
              "rgb(16, 185, 129)", // Teal
              "rgb(37, 99, 235)", // Indigo
            ],
            borderWidth: 1,
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  initPie() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      this.data = {
        labels: this.getTokensWithoutUSDT(),
        datasets: [
          {
            data: this.marketCaps,
            backgroundColor: [
              "rgba(249, 115, 22, 0.6)", // Darker Orange
              "rgba(6, 182, 212, 0.6)", // Darker Cyan
              "rgba(107, 114, 128, 0.6)", // Darker Gray
              "rgba(139, 92, 246, 0.6)", // Darker Purple
              "rgba(34, 197, 94, 0.6)", // Darker Green
              "rgba(239, 68, 68, 0.6)", // Darker Red
              "rgba(59, 130, 246, 0.6)", // Darker Blue
              "rgba(250, 204, 21, 0.6)", // Darker Yellow
              "rgba(217, 70, 239, 0.6)", // Darker Pink
              "rgba(16, 185, 129, 0.6)", // Darker Teal
              "rgba(37, 99, 235, 0.6)", // Darker Indigo
            ],
            hoverBackgroundColor: [
              "rgb(249, 115, 22)", // Orange
              "rgb(6, 182, 212)", // Cyan
              "rgb(107, 114, 128)", // Gray
              "rgb(139, 92, 246)", // Purple
              "rgb(34, 197, 94)", // Green
              "rgb(239, 68, 68)", // Red
              "rgb(59, 130, 246)", // Blue
              "rgb(250, 204, 21)", // Yellow
              "rgb(217, 70, 239)", // Pink
              "rgb(16, 185, 129)", // Teal
              "rgb(37, 99, 235)", // Indigo
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  getTokensWithoutUSDT(): string[] {
    return this.tokens.map((token: string) =>
      token.endsWith("USDT") ? token.slice(0, -4) : token
    );
  }
}

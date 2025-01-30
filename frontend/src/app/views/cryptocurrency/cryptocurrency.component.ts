import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { CryptocurrencyService } from "../../controllers/cryptocurrency/cryptocurrency.service";
import { Coin } from "../../models/coin/coin";
import { CryptocurrencySimulationService } from "../../controllers/cryptocurrency-simulation/cryptocurrency-simulation.service";
import {
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  TimeChartOptions,
} from "lightweight-charts";
import { Router } from "@angular/router";

@Component({
  selector: "app-cryptocurrency",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: "./cryptocurrency.component.html",
  styleUrl: "./cryptocurrency.component.css",
})
export class CryptocurrencyComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("chartContainerRef") chartContainer!: ElementRef;
  private chartOptions = {
    layout: {
      textColor: "black",
      background: { type: "solid", color: "white" },
    },
    timeScale: {
      timeVisible: true, // Show time instead of dates
      secondsVisible: false, // Hide seconds, show only minutes
    },
  };
  private chart!: IChartApi;
  private candlestickSeries!: ISeriesApi<any>;
  private priceAreaSeries!: ISeriesApi<any>;
  private confidenceLineSeries!: ISeriesApi<any>;
  chartType = true; // candlestick => true | area => false
  priceChart = true;

  private updateIntervalPeriod: any;
  private updateIntervalConfidence: any;

  coin: Coin = new Coin();
  tokenData: Record<string, number> = {};
  supply!: {
    circulatingSupply: number;
    maxSupply: number;
  };
  changePercentage: number = 0;
  positiveChange = true;

  constructor(
    private router: Router,
    private cryptocurrencyService: CryptocurrencyService
  ) {}

  ngOnInit(): void {
    if (
      this.cryptocurrencyService.selectedToken === undefined ||
      this.cryptocurrencyService.selectedToken === null
    )
      this.router.navigate(["/"]);
    this.cryptocurrencyService
      .getLastTwoPeriodsForToken(this.cryptocurrencyService.selectedToken)
      .subscribe((data) => {
        this.tokenData = data;
        this.cryptocurrencyService
          .getCoinStream(this.cryptocurrencyService.selectedToken)
          // .getCoinStream("BTCUSDT")
          .subscribe((result) => {
            this.coin = result.coin;
            this.supply = result.additionalData;
            this.update();
          });
      });
    this.updateIntervalPeriod = setInterval(() => {
      this.cryptocurrencyService
        .getLastTwoPeriodsForToken(this.cryptocurrencyService.selectedToken)
        .subscribe((data) => {
          this.tokenData = data;
        });
    }, 60 * 60 * 1000); // Every hour
  }

  ngAfterViewInit() {
    this.chart = createChart(
      this.chartContainer.nativeElement,
      this.chartOptions as DeepPartial<TimeChartOptions>
    );
    this.initCandlestickChart();
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.updateIntervalPeriod) {
      clearInterval(this.updateIntervalPeriod);
    }
    if (this.updateIntervalConfidence) {
      clearInterval(this.updateIntervalConfidence);
    }
  }

  initCandlestickChart() {
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    this.cryptocurrencyService
      .findAllTokenData(this.coin.token)
      .subscribe((data) => {
        this.candlestickSeries.setData(this.convertToCandlestickData(data));
        this.chart.timeScale().fitContent;
      });
  }

  initPriceAreaChart() {
    this.priceAreaSeries = this.chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });
    this.cryptocurrencyService
      .findAllTokenData(this.coin.token)
      .subscribe((data) => {
        this.priceAreaSeries.setData(this.convertToPriceAreaChartData(data));
        this.chart.timeScale().fitContent;
      });
  }

  initConfidenceLineChart() {
    this.confidenceLineSeries = this.chart.addLineSeries({
      color: "#7E57C2", // Purple
    });

    this.cryptocurrencyService.getMci(this.coin.token).subscribe((data) => {
      this.confidenceLineSeries.setData(
        this.convertToConfidenceLineChartData(data)
      );
      this.chart.timeScale().fitContent;
    });

    this.updateIntervalConfidence = setInterval(() => {
      this.cryptocurrencyService.getMci(this.coin.token).subscribe((data) => {
        this.confidenceLineSeries.setData(
          this.convertToConfidenceLineChartData(data)
        );
        this.chart.timeScale().fitContent;
      });
      // }, 1 * 10 * 1000);
    }, 120 * 60 * 1000); // Every 2 hours
  }

  switchChartType() {
    this.chartType = !this.chartType;
    if (this.chartType) {
      this.chart.removeSeries(this.priceAreaSeries);
      this.initCandlestickChart();
    } else {
      this.chart.removeSeries(this.candlestickSeries);
      this.initPriceAreaChart();
    }
  }

  switchChart(type: boolean) {
    if ((type && this.priceChart) || (!type && !this.priceChart)) return;
    this.priceChart = !this.priceChart;
    if (this.priceChart) {
      this.chart.removeSeries(this.confidenceLineSeries);
      if (this.chartType) this.initCandlestickChart();
      else this.initPriceAreaChart();
    } else {
      if (this.chartType) this.chart.removeSeries(this.candlestickSeries);
      else this.chart.removeSeries(this.priceAreaSeries);
      this.initConfidenceLineChart();
    }
  }

  update() {
    if (this.priceChart) {
      if (this.chartType) {
        this.candlestickSeries.update({
          open: this.coin.openPrice,
          high: this.coin.highestPrice,
          low: this.coin.lowestPrice,
          close: this.coin.closePrice,
          time: Math.floor(this.coin.startTime / 1_000_000_000) + 3600,
        });
      } else {
        this.priceAreaSeries.update({
          value: this.coin.closePrice,
          time: Math.floor(this.coin.startTime / 1_000_000_000) + 3600,
        });
      }
    }
    this.calculateGainOrLossPercentage();
  }

  calculateGainOrLossPercentage() {
    if (this.coin.closePrice > this.tokenData["close_price"])
      this.positiveChange = true;
    else this.positiveChange = false;
    this.changePercentage =
      ((this.coin.closePrice - this.tokenData["close_price"]) /
        this.tokenData["close_price"]) *
      100;
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

  convertToCandlestickData(backendData: any[]): any[] {
    return backendData.map((data) => {
      return {
        open: data.openPrice,
        high: data.highestPrice,
        low: data.lowestPrice,
        close: data.closePrice,
        time: Math.floor(new Date(data.startTime).getTime() / 1000) + 3600, // Convert ISO string to Unix timestamp in seconds
      };
    });
  }

  convertToPriceAreaChartData(backendData: any[]): any[] {
    return backendData.map((data) => {
      return {
        value: data.closePrice,
        time: Math.floor(new Date(data.startTime).getTime() / 1000) + 3600, // Convert ISO string to Unix timestamp in seconds
      };
    });
  }

  convertToConfidenceLineChartData(backendData: any[]): any[] {
    return backendData.map((data) => {
      return {
        value: data.ratio,
        time: Math.floor(new Date(data._start).getTime() / 1000) + 3600, // Convert ISO string to Unix timestamp in seconds
      };
    });
  }

  getIcon(token: string): string {
    token = token.replace("USDT", "").toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }

  removeUSDT(input: string): string {
    return input.endsWith("USDT") ? input.slice(0, -4) : input;
  }
}

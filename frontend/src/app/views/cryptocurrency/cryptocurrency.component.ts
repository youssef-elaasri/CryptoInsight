import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
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

@Component({
  selector: "app-cryptocurrency",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: "./cryptocurrency.component.html",
  styleUrl: "./cryptocurrency.component.css",
})
export class CryptocurrencyComponent implements OnInit, AfterViewInit {
  @ViewChild("chartContainerRef") chartContainer!: ElementRef;
  chartOptions = {
    layout: {
      textColor: "black",
      background: { type: "solid", color: "white" },
    },
  };
  chart!: IChartApi;
  candlestickSeries!: ISeriesApi<any>;
  areaSeries!: ISeriesApi<any>;
  chartType = true; // candlestick => true | area => false

  coin: Coin = new Coin();
  previousClose: number = 0;
  changePercentage: number = 0;
  positiveChange = true;

  constructor(
    private cryptocurrencyService: CryptocurrencyService,
    private cryptocurrencySimulationService: CryptocurrencySimulationService
  ) {}

  ngOnInit(): void {
    this.cryptocurrencySimulationService
      .getCoinStream(this.cryptocurrencyService.selectedToken)
      .subscribe((coin) => {
        this.coin = coin;
        this.update();
        this.previousClose = this.coin.closePrice;
      });
    // this.cryptocurrencySimulationService
    //   .getCoinStream("BTC")
    //   .subscribe((coin) => {
    //     this.coin = coin;
    //     this.update();
    //     this.previousClose = this.coin.closePrice;
    //   });
  }

  ngAfterViewInit() {
    this.chart = createChart(
      this.chartContainer.nativeElement,
      this.chartOptions as DeepPartial<TimeChartOptions>
    );
    this.initCandlestickChart();
  }

  initCandlestickChart() {
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    // const candlestickData = [
    //   { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
    //   { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
    //   { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
    //   { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
    //   { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
    //   {
    //     open: 10.17,
    //     high: 10.96,
    //     low: 10.16,
    //     close: 10.47,
    //     time: 1642859876,
    //   },
    //   { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
    //   { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
    //   { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
    //   {
    //     open: 10.93,
    //     high: 11.53,
    //     low: 10.76,
    //     close: 10.96,
    //     time: 1643205476,
    //   },
    // ];

    // this.candlestickSeries.setData(candlestickData);
    this.chart.timeScale().fitContent();
  }

  initAreaChart() {
    this.areaSeries = this.chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });
    // const areaData = [
    //   { value: 0, time: 1642425322 },
    //   { value: 8, time: 1642511722 },
    //   { value: 10, time: 1642598122 },
    //   { value: 20, time: 1642684522 },
    //   { value: 3, time: 1642770922 },
    //   { value: 43, time: 1642857322 },
    //   { value: 41, time: 1642943722 },
    //   { value: 43, time: 1643030122 },
    //   { value: 56, time: 1643116522 },
    //   { value: 46, time: 1643202922 },
    // ];

    // this.areaSeries.setData(areaData);
    this.chart.timeScale().fitContent();
  }

  switchChart() {
    this.chartType = !this.chartType;
    if (this.chartType) {
      this.chart.removeSeries(this.areaSeries);
      this.initCandlestickChart();
    } else {
      this.chart.removeSeries(this.candlestickSeries);
      this.initAreaChart();
    }
  }

  update() {
    if (this.chartType) {
      this.candlestickSeries.update({
        open: this.coin.openPrice,
        high: this.coin.highestPrice,
        low: this.coin.lowestPrice,
        close: this.coin.closePrice,
        time: this.coin.startTime,
      });
    } else {
      this.areaSeries.update({
        value: this.coin.closePrice,
        time: this.coin.startTime,
      });
    }
    this.calculateGainOrLossPercentage();
  }

  calculateGainOrLossPercentage() {
    if (this.previousClose === 0) {
      return; // Avoid division by zero
    }
    if (this.coin.closePrice > this.previousClose) this.positiveChange = true;
    else this.positiveChange = false;
    this.changePercentage =
      ((this.coin.closePrice - this.previousClose) / this.previousClose) * 100;
  }

  getIcon(token: string): string {
    if (token === undefined) return token;
    token = token.toLowerCase();
    token = "images/" + token + ".png";
    return token;
  }
}

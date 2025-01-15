import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as echarts from "echarts";
import { CardModule } from "primeng/card";
import { CfgiService } from "../../controllers/cfgi/cfgi.service";

@Component({
  selector: "app-cfgi",
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: "./cfgi.component.html",
  styleUrl: "./cfgi.component.css",
})
export class CfgiComponent implements OnInit, AfterViewInit {
  @ViewChild("gaugeChart") gaugeChart!: ElementRef;

  private chart: any;
  private updateInterval: any;

  constructor(private cfgiService: CfgiService) {}

  ngOnInit() {
    this.updateChart(
      this.todayData.value || 50,
      this.todayData.classification || "Neutral"
    );

    // Set an interval to update the chart every 30 minutes
    this.updateInterval = setInterval(() => {
      this.updateChart(
        this.todayData.value || 50,
        this.todayData.classification || "Neutral"
      );
    }, 2 * 60 * 1000); // 30 minutes in milliseconds
  }

  ngAfterViewInit(): void {
    this.initChart();
    this.updateChart(
      this.todayData.value || 50,
      this.todayData.classification || "Neutral"
    );
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  initChart(): void {
    const chartDom = this.gaugeChart.nativeElement;
    this.chart = echarts.init(chartDom);

    const option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
      },
      series: [
        {
          name: "CFGI",
          type: "gauge",
          detail: { formatter: "{value}" },
          data: [{ value: 50, name: "Neutral" }],
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.25, "#EA3943"],
                [0.5, "#ED9E27"],
                [0.75, "#93D900"],
                [1, "#16C784"],
              ],
            },
          },
        },
      ],
    };

    this.chart.setOption(option);
  }

  updateChart(newValue: number | null, classification: string): void {
    const option = {
      series: [
        {
          data: [{ value: newValue, name: classification }],
        },
      ],
    };

    this.chart.setOption(option);
  }

  getColorByValue(value: number): string {
    if (value < 25) {
      return "#FF4500"; // Extreme Fear (Red)
    } else if (value < 50) {
      return "#FFD700"; // Fear (Yellow)
    } else if (value < 75) {
      return "#32CD32"; // Greed (Light Green)
    } else {
      return "#228B22"; // Extreme Greed (Dark Green)
    }
  }

  public get todayData(): {
    value: number | null;
    classification: string | null;
  } {
    return this.cfgiService.todayData;
  }
  public set todayData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this.cfgiService.todayData = value;
  }
  public get yesterdayData(): {
    value: number | null;
    classification: string | null;
  } {
    return this.cfgiService.yesterdayData;
  }
  public set yesterdayData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this.cfgiService.yesterdayData = value;
  }
  public get lastWeekData(): {
    value: number | null;
    classification: string | null;
  } {
    return this.cfgiService.lastWeekData;
  }
  public set lastWeekData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this.cfgiService.lastWeekData = value;
  }
  public get lastMonthData(): {
    value: number | null;
    classification: string | null;
  } {
    return this.cfgiService.lastMonthData;
  }
  public set lastMonthData(value: {
    value: number | null;
    classification: string | null;
  }) {
    this.cfgiService.lastMonthData = value;
  }
}

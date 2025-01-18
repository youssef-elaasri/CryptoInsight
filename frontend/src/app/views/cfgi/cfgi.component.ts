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
import { Router } from "@angular/router";
import { interval, filter, take } from "rxjs";

@Component({
  selector: "app-cfgi",
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: "./cfgi.component.html",
  styleUrl: "./cfgi.component.css",
})
export class CfgiComponent implements AfterViewInit, OnDestroy {
  @ViewChild("gaugeChart") gaugeChart!: ElementRef;

  private chart: any;
  private updateInterval: any;

  constructor(private router: Router, private cfgiService: CfgiService) {}

  ngAfterViewInit(): void {
    if (this.todayData.value === undefined || this.todayData.value === null) {
      // Poll until todayData is available
      interval(200) // Poll every 200ms
        .pipe(
          filter(
            () =>
              Object.keys(this.todayData) !== undefined &&
              Object.keys(this.todayData) !== null
          ), // Check length
          take(1) // Complete after the condition is met
        )
        .subscribe(() => {
          this.initChart();
        });
    } else {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
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
          data: [
            {
              value: this.todayData.value,
              name: this.todayData.classification,
            },
          ],
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

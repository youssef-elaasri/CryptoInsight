import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-fgi",
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: "./fgi.component.html",
  styleUrl: "./fgi.component.css",
})
export class FgiComponent {}

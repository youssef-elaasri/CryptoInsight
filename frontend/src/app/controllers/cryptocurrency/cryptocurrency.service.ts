import { Injectable } from "@angular/core";
import { Coin } from "../../models/coin/coin";

@Injectable({
  providedIn: "root",
})
export class CryptocurrencyService {
  private _selectedToken!: string;

  constructor() {}

  public get selectedToken(): string {
    return this._selectedToken;
  }
  public set selectedToken(value: string) {
    this._selectedToken = value;
  }
}

import { Routes } from "@angular/router";
import { CryptocurrenciesComponent } from "./views/cryptocurrencies/cryptocurrencies.component";
import { CryptocurrencyComponent } from "./views/cryptocurrency/cryptocurrency.component";
import { CfgiComponent } from "./views/cfgi/cfgi.component";

export const routes: Routes = [
  {
    path: "",
    component: CryptocurrenciesComponent,
  },
  {
    path: "cryptocurrency",
    component: CryptocurrencyComponent,
  },
  {
    path: "fgi",
    component: CfgiComponent,
  },
];

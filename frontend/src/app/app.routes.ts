import { Routes } from "@angular/router";
import { CryptocurrenciesComponent } from "./views/cryptocurrencies/cryptocurrencies.component";
import { CryptocurrencyComponent } from "./views/cryptocurrency/cryptocurrency.component";
import { FgiComponent } from "./views/fgi/fgi.component";

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
    component: FgiComponent,
  },
];

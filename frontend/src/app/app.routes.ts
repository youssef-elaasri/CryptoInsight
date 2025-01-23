import { Routes } from "@angular/router";
import { CryptocurrenciesComponent } from "./views/cryptocurrencies/cryptocurrencies.component";
import { CryptocurrencyComponent } from "./views/cryptocurrency/cryptocurrency.component";
import { CfgiComponent } from "./views/cfgi/cfgi.component";
import { DominanceComponent } from "./views/dominance/dominance.component";

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
    path: "cfgi",
    component: CfgiComponent,
  },
  {
    path: "dominance",
    component: DominanceComponent,
  },
];

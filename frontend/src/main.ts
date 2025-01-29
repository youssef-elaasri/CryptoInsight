import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { CryptocurrencyService } from "./app/controllers/cryptocurrency/cryptocurrency.service";
import { CfgiService } from "./app/controllers/cfgi/cfgi.service";
import { DominanceService } from "./app/controllers/dominance/dominance.service";

const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Preserve existing providers
    CryptocurrencyService,
    CfgiService,
    DominanceService, // Add StartupService to ensure its constructor runs
  ],
};

bootstrapApplication(AppComponent, updatedAppConfig).catch((err) =>
  console.error(err)
);

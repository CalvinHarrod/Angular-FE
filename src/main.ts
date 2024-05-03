import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

  if (environment.production) {
    enableProdMode();
    window.console.log = function() {}; // Disable console.log in production
    window.console.error = function() {}; // Disable console.error in production
    window.console.warn = function() {}; // Disable console.warn in production
    window.console.info = function() {}; // Disable console.info in production
  }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// noinspection JSUnusedGlobalSymbols

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LoaderService} from "./app/services/loader/loader.service";

declare global {
  interface Window {
    AppLoader: LoaderService;
  }
}

window.AppLoader = window.AppLoader || {};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

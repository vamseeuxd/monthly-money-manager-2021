// noinspection JSUnusedGlobalSymbols

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LoaderService} from "./app/services/loader/loader.service";
import firebase from "firebase";

declare global {
  interface Window {
    AppLoader: LoaderService;
    getServerTime: () => number;
  }
}

window.AppLoader = window.AppLoader || {};
window.getServerTime = () => {
  return firebase.firestore.Timestamp.now().seconds * 1000
};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

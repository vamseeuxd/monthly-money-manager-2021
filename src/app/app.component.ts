import {
  CONFIRMATION_SERVICE_TOKEN,
  ConfirmationService,
} from './component/confirmation/service/confirmation.service';
import { ApplicationRef, Component, HostBinding, Inject } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap, mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // @HostBinding('class') cssClass = 'd-flex justify-content-center align-items-center flex-column vw-100 vh-100 min-vw-100 min-vh-100';
  selectedPage = 'Expenses';
  constructor(
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private swPush: SwPush,
    private afMessaging: AngularFireMessaging,
    @Inject(CONFIRMATION_SERVICE_TOKEN)
    private confirmationService: ConfirmationService
  ) {
    this.updateClient();
    this.checkUpdate();
    this.requestMessagingPermission();
  }

  requestMessagingPermission() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Permission granted! Save to the server!', token);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteMessagingToken() {
    this.afMessaging.getToken
      // @ts-ignore
      .pipe(mergeMap((token) => this.afMessaging.deleteToken(token)))
      .subscribe((token) => {
        console.log('Token deleted!');
      });
  }

  listenMessaging() {
    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe((event) => {
      this.confirmationService.open(
        'new update is available for the app.',
        (confirmed) => {
          if (confirmed) {
            this.update.activateUpdate().then(() => location.reload());
          }
        },
        true
      );
    });

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available `, event.current);
    });
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        /* const timeInterval = interval(2000);
        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => {
            console.log('checked');
          });
          console.log('update checked');
        }); */
        const timeId = setTimeout(() => {
          this.update.checkForUpdate().then(() => {
            console.log('checked');
            clearTimeout(timeId);
          });
        }, 2000);
      }
    });
  }
}

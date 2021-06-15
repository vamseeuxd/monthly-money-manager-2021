import {CONFIRMATION_SERVICE_TOKEN, ConfirmationService,} from './component/confirmation/service/confirmation.service';
import {ApplicationRef, Component, Inject} from '@angular/core';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {SideMenuComponent} from "./component/side-menu/side-menu.component";
import {LoaderService} from "./services/loader/loader.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FirebaseCloudMessageService} from "./services/firebase-cloud-message/firebase-cloud-message.service";

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
    private fcmService: FirebaseCloudMessageService,
    public auth: AngularFireAuth,
    public route: Router,
    public loader: LoaderService,
    private snackBar: MatSnackBar,
    @Inject(CONFIRMATION_SERVICE_TOKEN)
    private confirmationService: ConfirmationService
  ) {
    this.updateClient();
    this.checkUpdate();
    window.AppLoader = loader;
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    const subscription1 = this.update.available.subscribe(() => {
      setTimeout(() => {
        subscription1.unsubscribe();
      })
      this.confirmationService.open(
        'new New Version is available for Update APP.',
        (confirmed) => {
          if (confirmed) {
            this.update.activateUpdate().then(() => {
              const loaderId = window.AppLoader.show();
              location.reload();
              window.AppLoader.hide(loaderId);
              setTimeout(() => {
                this.snackBar.open('Updated with New Version, Thank You...', 'Update Completed');
              }, 500);
            });
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
    const subscription1 = this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        this.update.checkForUpdate().then(() => {
          console.log('checked For Update');
        });
      }
      setTimeout(() => {
        subscription1.unsubscribe();
      })
    });
  }

  toggleSideMenu(appSideMenu: SideMenuComponent) {
    appSideMenu.open = !appSideMenu.open;
  }
}

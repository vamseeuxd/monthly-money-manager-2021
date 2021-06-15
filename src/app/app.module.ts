import {CONFIRMATION_SERVICE_TOKEN, ConfirmationService} from './component/confirmation/service/confirmation.service';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExpensesComponent} from './pages/expenses/expenses.component';
import {SideMenuComponent} from './component/side-menu/side-menu.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ConfirmationComponent} from './component/confirmation/confirmation.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {AngularFireModule} from '@angular/fire';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {LoginComponent} from './pages/login/login.component';
import {UserComponent} from './pages/user/user.component';
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ManageNotificationComponent } from './pages/manage-notification/manage-notification.component';

@NgModule({
  declarations: [AppComponent, ExpensesComponent, SideMenuComponent, ConfirmationComponent, LoginComponent, UserComponent, ManageNotificationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClickOutsideModule,
    DragDropModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:0',
    }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    MatCardModule,
  ],
  providers: [
    {provide: CONFIRMATION_SERVICE_TOKEN, useClass: ConfirmationService},
  ],
  entryComponents: [ConfirmationComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}

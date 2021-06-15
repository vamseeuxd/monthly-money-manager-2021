import {Component, Inject, Injectable} from '@angular/core';
import firebase from "firebase";
import {BehaviorSubject, combineLatest, from, Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireMessaging} from "@angular/fire/messaging";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {DeviceUUID} from 'device-uuid';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from "@angular/material/snack-bar";
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar/snack-bar-config";

export interface IMessagingToken {
  createdOn: number,
  updatedOn: number,
  id: string;
  email: string;
  platform: string;
  token: string;
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <div class="snack-container">
      <div class="snack-container-message">
        <div class="w-100 d-flex justify-content-between align-items-center">
          <ng-container *ngIf="data?.value?.notification?.icon">
            <img [src]="data.value.notification.icon">
          </ng-container>
          <div class="w-100 pl-2">
            <ng-container *ngIf="data?.value?.notification?.title">
              <h2 class="m-0 p-0">{{data.value.notification.title}}</h2>
            </ng-container>
            <ng-container *ngIf="data?.value?.notification?.body">
              <h3 class="m-0 p-0">{{data.value.notification.body}}</h3>
            </ng-container>
          </div>
          <div class="snack-container-icon">
            <i style="font-size: 20px;" class="fa fa-close" (click)="closeSnackbar()"></i>
          </div>
        </div>
      </div>
  `,
  styles: [``],
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(data);
  }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseCloudMessageService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  /**
   * ts-ignore for 'userDetails' has no initializer and is not definitely assigned in the constructor
   * @ts-ignore */
  userDetails: firebase.User | null;

  /**
   * ts-ignore for 'token' has no initializer and is not definitely assigned in the constructor
   * @ts-ignore */
  token = '';
  deviceId = '';
  tokenAction: BehaviorSubject<string | null> = new BehaviorSubject<string | null>('');
  token$: Observable<string | null> = this.tokenAction.asObservable();
  private messagingTokensCollection: AngularFirestoreCollection<IMessagingToken>;
  private platform = '';

  constructor(
    private afMessaging: AngularFireMessaging,
    private afs: AngularFirestore,
    public snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
  ) {
    // window.registerForMessage = this.registerForMessage.bind(this);
    this.messagingTokensCollection = afs.collection<IMessagingToken>('messagingTokens');
    setTimeout(() => {
      this.deviceId = new DeviceUUID().get();
      this.platform = new DeviceUUID().parse().platform;
      this.afMessaging.getToken.subscribe(value => {
        this.token = value ? value : '';
        this.tokenAction.next(this.token);
        if (!value) {
          combineLatest([this.afAuth.user, this.afMessaging.requestToken])
            .subscribe(async ([user, token]) => {
              this.userDetails = user;
              if (user && user.email && token) {
                this.token = token;
                this.tokenAction.next(this.token);
                const busyIndicatorId = window.AppLoader.show();
                // const docRef = this.messagingTokensCollection.ref.doc();
                const docRef = this.messagingTokensCollection.doc(this.deviceId);
                const id = this.deviceId;
                const platform = this.platform;
                const email = user.email;
                const createdOn = window.getServerTime();
                const updatedOn = window.getServerTime();
                try {
                  await docRef.set({email, id, createdOn, updatedOn, token, platform})
                  window.AppLoader.hide(busyIndicatorId);
                } catch (e) {
                  console.error(e);
                  window.AppLoader.hide(busyIndicatorId);
                }
              } else (user && user.email && token)
              {
                console.warn('Remove Token from DB', this.token);
              }
            })
        }
      })
    }, 50);
    this.registerForMessage();
  }

  getSendMessageRequest(title: string, body: string, icon: string, to: string) {
    const key = 'AAAApGJCCdk:APA91bEJQG8GU7Q1hvT8oHXSQ2tEOvoBPOShNYzLokdxy5cIO_CFDOldvIzj0c7KYLNR8vUqWccslTgd52WaBYYyP7Zj01dke9HKPxyodgM4A0zM36BL3CFdpux0aNKS0mJ8RH7THnoy';
    const notification = {title, body, icon};
    return from(
      fetch(
        'https://fcm.googleapis.com/fcm/send',
        {
          'method': 'POST',
          'headers': {'Authorization': 'key=' + key, 'Content-Type': 'application/json'},
          'body': JSON.stringify({'notification': notification, 'to': to})
        }
      ).then(res => res.json())
    );
  }

  registerForMessage(): void {
    /*const value = {
      "from": "706023131609",
      "priority": "normal",
      "notification": {
        "title": "Test",
        "icon": "https://firebasestorage.googleapis.com/v0/b/monthly-money-manager-7c461.appspot.com/o/icon-50x50.png?alt=media&token=7a9a8b0b-05f1-4075-b230-8e5c2489bae7",
        "body": "this message for your support"
      },
      "collapse_key": "do_not_collapse"
    };
    this.openSnackBar(value, 'error');*/
    this.afMessaging.messages.subscribe((value: any) => {
      this.openSnackBar(value, 'error')
    })
  }

  public openSnackBar(value: any, type: string, duration?: number, verticalPosition?: MatSnackBarVerticalPosition, horizontalPosition?: MatSnackBarHorizontalPosition) {
    const _snackType = type !== undefined ? type : 'success';
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: duration || 4000,
      horizontalPosition: horizontalPosition || 'end',
      verticalPosition: verticalPosition || 'bottom',
      data: {value: value, snackType: _snackType, snackBar: this.snackBar}
    });
  }

}

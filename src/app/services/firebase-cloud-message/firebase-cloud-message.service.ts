import {Injectable} from '@angular/core';
import firebase from "firebase";
import {BehaviorSubject, combineLatest, from, Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireMessaging} from "@angular/fire/messaging";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {DeviceUUID} from 'device-uuid';

export interface IMessagingToken {
  createdOn: number,
  updatedOn: number,
  id: string;
  email: string;
  platform: string;
  token: string;
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
    private afAuth: AngularFireAuth
  ) {
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
    this.afMessaging.messages.subscribe(value => {
      console.log(value);
    })
  }

}

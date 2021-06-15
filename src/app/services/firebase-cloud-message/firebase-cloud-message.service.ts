import {Injectable} from '@angular/core';
import firebase from "firebase";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireMessaging} from "@angular/fire/messaging";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";

export interface IMessagingToken {
  createdOn: number,
  updatedOn: number,
  id: string;
  email: string;
  token: string
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
  token: string = '';
  tokenAction: BehaviorSubject<string | null> = new BehaviorSubject<string | null>('');
  token$: Observable<string | null> = this.tokenAction.asObservable();
  private messagingTokensCollection: AngularFirestoreCollection<IMessagingToken>;

  constructor(
    private afMessaging: AngularFireMessaging,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.messagingTokensCollection = afs.collection<IMessagingToken>('messagingTokens');
    setTimeout(() => {
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
                const docRef = this.messagingTokensCollection.ref.doc();
                const id = docRef.id;
                const email = user.email;
                const createdOn = window.getServerTime();
                const updatedOn = window.getServerTime();
                try {
                  await docRef.set({email, id, createdOn, updatedOn, token,})
                  window.AppLoader.hide(busyIndicatorId);
                } catch (e) {
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
  }

  receiveMessage() {
    /*this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    });*/
  }
}

import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase";
import {Router} from "@angular/router";
import {FirebaseCloudMessageService} from "../../services/firebase-cloud-message/firebase-cloud-message.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(
    public auth: AngularFireAuth,
    public fcmService: FirebaseCloudMessageService,
    public route: Router
  ) {
  }

  async login() {
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  async logout() {
    await window.AppLoader.logout();
  }

}

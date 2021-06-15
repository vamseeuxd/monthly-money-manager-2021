import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(
    public auth: AngularFireAuth,
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

import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    public auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    public route: Router,
  ) {
  }

  async login() {
    const loaderId = window.AppLoader.show();
    try {
      await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      await this.route.navigate(['expenses']);
      window.AppLoader.hide(loaderId);
    } catch (e) {
      console.log(e);
      this.snackBar.open(e.message, 'Error');
      window.AppLoader.hide(loaderId);
    }
  }

}

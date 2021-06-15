import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationService} from "../../component/confirmation/service/confirmation.service";

@Injectable({providedIn: 'root'})
export class LoaderService {
  private loaderRequestsList: number[] = [];
  private loaderSubject = new BehaviorSubject<boolean>(this.loaderRequestsList.length > 0);
  showLoader$ = this.loaderSubject.asObservable();

  constructor(
    public auth: AngularFireAuth,
    public route: Router,
    private snackBar: MatSnackBar,
    public confirmation: ConfirmationService
  ) {
  }

  show(): number {
    const id = new Date().getTime();
    this.loaderRequestsList.push(id);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    return id;
  }

  hide(loaderId: number): void {
    this.loaderRequestsList = this.loaderRequestsList.filter(id => id !== loaderId);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
  }

  logout() {
    this.confirmation.open('Are you sure!Do you want to Logout?', async (confirmed) => {
      if (confirmed) {
        const loaderId = window.AppLoader.show();
        try {
          await this.auth.signOut();
          await this.route.navigate(['login']);
          window.AppLoader.hide(loaderId);
        } catch (e) {
          this.snackBar.open(e.message, 'Error');
          window.AppLoader.hide(loaderId);
        }

      }
    }, false, {ok: 'Yes', cancel: 'No'});
  }
}

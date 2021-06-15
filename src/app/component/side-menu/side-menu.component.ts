import {Component, HostBinding, Input} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

// noinspection JSUnusedLocalSymbols
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @HostBinding('class') cssClassName = 'close-menu';

  constructor(
    public auth: AngularFireAuth,
    public route: Router,
    private snackBar: MatSnackBar
  ) {
  }

  private _open = false;
  public get open() {
    return this._open;
  }

  @Input()
  public set open(value) {
    this._open = value;
    this.cssClassName = value ? '' : 'close-menu';
  }

  onClickedOutside() {
    this.open = false;
  }

  async logout() {
    await window.AppLoader.logout();
  }
}

import { Component, HostBinding, Input } from '@angular/core';

// noinspection JSUnusedLocalSymbols
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @HostBinding('class') cssClassName = 'close-menu';
  constructor() {}

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
}

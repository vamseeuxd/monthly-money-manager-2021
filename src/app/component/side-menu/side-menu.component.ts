import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
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

  ngOnInit(): void {}

  onClickedOutside(e: Event) {
    this.open = false;
  }
}

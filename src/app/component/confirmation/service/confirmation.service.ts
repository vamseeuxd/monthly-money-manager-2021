import {ConfirmationComponent} from '../confirmation.component';
import {Injectable, InjectionToken} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

export interface IConfirmationData {
  message: string,
  buttonText: { ok: string, cancel: string },
  isAlert: boolean,
}

@Injectable({providedIn: 'root'})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {
  }

  open(
    message: string,
    callBack: (confirmed: boolean) => void,
    isAlert = false,
    buttonText = {ok: 'OK', cancel: 'Cancel'}
  ) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      data: {
        message,
        buttonText,
        isAlert,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      callBack && callBack(confirmed);
    });
  }
}

export const CONFIRMATION_SERVICE_TOKEN =
  new InjectionToken<ConfirmationService>('CONFIRMATION_SERVICE ');

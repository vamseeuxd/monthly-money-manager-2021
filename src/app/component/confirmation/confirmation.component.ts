import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {IConfirmationData} from "./service/confirmation.service";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  message = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';
  isAlert = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IConfirmationData,
    private dialogRef: MatDialogRef<ConfirmationComponent>
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
        this.isAlert = data.isAlert;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}

import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {
  FirebaseCloudMessageService,
  IMessagingToken
} from "../../services/firebase-cloud-message/firebase-cloud-message.service";
import {NgForm} from "@angular/forms";
import {forkJoin} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.scss']
})
export class ManageNotificationComponent implements OnInit {
  hideFooter = true;
  // @ts-ignore
  messagingTokens: IMessagingToken[] = [];
  selectedIds: string[] = [];

  constructor(
    public afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public fcmService: FirebaseCloudMessageService,
  ) {
    const loaderId = window.AppLoader.show();
    afs.collection<IMessagingToken>('messagingTokens').valueChanges().subscribe(value => {
      this.messagingTokens = value;
      window.AppLoader.hide(loaderId);
    })
  }

  ngOnInit(): void {
  }

  isSelected(id: string): boolean {
    return this.selectedIds.indexOf(id) >= 0;
  }

  toggleSelection(id: string): void {
    const idIndex = this.selectedIds.indexOf(id);
    if (idIndex >= 0) {
      this.selectedIds.splice(idIndex, 1);
    } else {
      this.selectedIds.push(id);
    }
  }

  // {"multicast_id":2532717427176027534,"success":1,"failure":0,"canonical_ids":0,"results":[{"message_id":"0:1623777483075875%0f493ae6f9fd7ecd"}]}
  sendMessageToSelected(sampleForm: NgForm, close: boolean) {
    const requests: any[] = [];
    this.selectedIds.forEach(value => {
      const toToken = this.messagingTokens.find(value1 => value1.id == value);
      if (toToken) {
        debugger;
        requests.push(this.fcmService.getSendMessageRequest(
          sampleForm.value.title,
          sampleForm.value.body,
          sampleForm.value.icon,
          toToken.token
        ));
      }
    });
    if (requests && requests.length > 0) {
      const loaderId = window.AppLoader.show();
      forkJoin(requests)
        .subscribe((value: any[]) => {
          debugger;
          window.AppLoader.hide(loaderId);
          if (close) {
            sampleForm.resetForm({});
            this.selectedIds = [];
            this.hideFooter = true;
          }
          this.snackBar.open(`success : ${value.filter(x => x.success).length} & failure : ${value.filter(x => x.failure).length}`, 'Close')
        }, error => {
          debugger;
          window.AppLoader.hide(loaderId);
        })
    }
  }
}

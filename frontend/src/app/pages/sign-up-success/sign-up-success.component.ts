import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.scss'],
})
export class SignUpSuccessComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SignUpSuccessComponent>) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onContinueClick() {
    this.dialogRef.close();
  }
}

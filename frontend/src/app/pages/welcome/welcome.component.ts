import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<WelcomeComponent>) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onContinueClick(): void {
    this.dialogRef.close();
  }
}

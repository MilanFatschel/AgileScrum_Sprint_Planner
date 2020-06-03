import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sprint',
  templateUrl: './delete-sprint.component.html',
  styleUrls: ['./delete-sprint.component.scss'],
})
export class DeleteSprintComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteSprintComponent>) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }
}

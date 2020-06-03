import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-story',
  templateUrl: './delete-story.component.html',
  styleUrls: ['./delete-story.component.scss'],
})
export class DeleteStoryComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteStoryComponent>) {}

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

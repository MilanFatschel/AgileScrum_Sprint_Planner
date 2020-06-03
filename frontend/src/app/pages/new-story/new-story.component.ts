import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SprintService } from 'src/app/services/sprint.service';
import { Router, Params } from '@angular/router';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.scss'],
})
export class NewStoryComponent implements OnInit {
  sprintId: String;
  newStoryInputText: String = '';

  constructor(
    private _sprintService: SprintService,
    public dialogRef: MatDialogRef<NewStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCreateStoryClick(title: string) {
    this._sprintService
      .createStory(title, this.data.sprintId)
      .subscribe((story: Story) => {
        this.dialogRef.close(story);
      });
  }
}

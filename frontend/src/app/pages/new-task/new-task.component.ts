import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintService } from '../../services/sprint.service';
import { Task } from './../../models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  sprintId: String;
  storyId: String;
  titleInputText: String = '';
  nameInputText: String = '';
  hoursInputNumber: Number;

  constructor(
    private _sprintService: SprintService,
    public dialogRef: MatDialogRef<NewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(title: string, assignedName: string, hours: Number) {
    const payload = {
      title,
      state: '1',
      assignedName,
      hours,
    };

    this._sprintService
      .createTask(payload, this.data.sprintId, this.data.storyId)
      .subscribe((task: Task) => {
        this.dialogRef.close(task);
      });
  }
}

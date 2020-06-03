import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { SprintService } from 'src/app/services/sprint.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  task: Task;
  titleInputText: String = this.data.task.title;
  nameInputText: String = this.data.task.assignedName;
  hoursInputNumber: Number = this.data.task.hours;

  constructor(
    private _sprintService: SprintService,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
    // this.titleInputText = this.data.task.title;
    // this.nameInputText = this.data.task.assignedName;
    // this.hoursInputNumber = this.data.task.hours;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(title: string, assignedName: String, hours: Number) {
    const state = this.data.task.state;
    const payload = {
      title,
      assignedName,
      hours,
      state,
    };
    this._sprintService
      .updateTask(
        payload,
        this.data.task._sprintId,
        this.data.task._storyId,
        this.data.task._id
      )
      .subscribe((updatedTask) => {
        this.dialogRef.close(updatedTask);
      });
  }
}

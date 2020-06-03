import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Task } from 'src/app/models/task.model';
import { SprintService } from 'src/app/services/sprint.service';
import { EditTaskComponent } from 'src/app/pages/edit-task/edit-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskEdited: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private sprintService: SprintService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onDeleteTaskClick() {
    this.taskDeleted.emit(this.task);
    this.sprintService
      .deleteTask(this.task._sprintId, this.task._storyId, this.task._id)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  onEditTaskClick() {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {
        task: this.task,
      },
    });

    dialogRef.afterClosed().subscribe((editedTask) => {
      if (editedTask) {
        this.task = editedTask;
        this.taskEdited.emit(editedTask);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SprintService } from 'src/app/services/sprint.service';
import { Sprint } from 'src/app/models/sprint.model';

@Component({
  selector: 'app-new-sprint',
  templateUrl: './new-sprint.component.html',
  styleUrls: ['./new-sprint.component.scss'],
})
export class NewSprintComponent implements OnInit {
  newSprintInputText: String = '';

  constructor(
    private _sprintService: SprintService,
    public dialogRef: MatDialogRef<NewSprintComponent>
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('650px', '550px');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(title: string) {
    this._sprintService.createSprint(title).subscribe((sprint: Sprint) => {
      this.dialogRef.close(sprint);
    });
  }
}

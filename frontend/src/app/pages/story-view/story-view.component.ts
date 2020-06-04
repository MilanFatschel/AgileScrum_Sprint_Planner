import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SprintService } from '../../services/sprint.service';
import { AuthService } from 'src/app/services/auth.service';

import { NewSprintComponent } from 'src/app/pages/new-sprint/new-sprint.component';
import { DeleteSprintComponent } from 'src/app/pages/delete-sprint/delete-sprint.component';
import { DeleteStoryComponent } from 'src/app/pages/delete-story/delete-story.component';
import { NewStoryComponent } from 'src/app/pages/new-story/new-story.component';
import { Story } from 'src/app/models/story.model';
import { Sprint } from 'src/app/models/sprint.model';

@Component({
  selector: 'app-story-view',
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.scss'],
})
export class StoryViewComponent implements OnInit {
  sprints: Sprint[];
  stories: Story[];

  selectedSprintId: string;

  constructor(
    private sprintService: SprintService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.sprintId) {
        this.selectedSprintId = params.sprintId;
        this.sprintService
          .getStories(params.sprintId)
          .subscribe((stories: Story[]) => {
            this.stories = stories;
          });
      } else {
        this.stories = null;
      }
    });
    this.sprintService.getSprints().subscribe((sprints: Sprint[]) => {
      this.sprints = sprints;
    });
  }

  onAddSprintClick() {
    const dialogRef = this.dialog.open(NewSprintComponent);

    dialogRef.afterClosed().subscribe((createdSprint) => {
      if (createdSprint) {
        this.sprints.push(createdSprint);
      }
    });
  }

  onAddStoryClick() {
    const dialogRef = this.dialog.open(NewStoryComponent, {
      data: {
        sprintId: this.selectedSprintId,
      },
    });

    dialogRef.afterClosed().subscribe((createdStory) => {
      if (createdStory) {
        this.stories.push(createdStory);
      }
    });
  }

  onDeleteSprintClick(sprintId: string) {
    const dialogRef = this.dialog.open(DeleteSprintComponent, {});

    dialogRef.afterClosed().subscribe((confirmedDelete) => {
      if (confirmedDelete) {
        this.sprintService.deleteSprint(sprintId).subscribe((res: any) => {
          this.router.navigate(['/sprints']);
        });
      }
    });
  }

  removeDeletedStory($event) {
    const dialogRef = this.dialog.open(DeleteStoryComponent, {});

    dialogRef.afterClosed().subscribe((confirmedDelete) => {
      if (confirmedDelete) {
        let storyToDelete = $event;
        this.stories = this.stories.filter(
          (val) => val._id !== storyToDelete._id
        );
      }
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

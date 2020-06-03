import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../../services/sprint.service';
import { MatDialog } from '@angular/material/dialog';

import { NewTaskComponent } from 'src/app/pages/new-task/new-task.component';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  @Input() story: Story;

  @Output() storyDeleted: EventEmitter<Story> = new EventEmitter<Story>();

  newTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
  activatedRoute: ActivatedRoute;
  isLoaded: number;
  totalHoursNew: number;
  totalHoursInProgress: number;
  storyId: String;
  sprintId: String;

  constructor(
    private sprintService: SprintService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.forEach((params) => {
      this.initializeData(params['sprintId']);
      this.sprintId = params['sprintId'];
    });
  }

  initializeData(sprintId: String) {
    // process new data on route change
    this.isLoaded = 0;
    this.getTasks(sprintId);
  }

  getTasks(sprintId: String) {
    if (sprintId) {
      this.sprintService
        .getTasks('1', sprintId, this.story._id)
        .subscribe((newTasks: Task[]) => {
          this.newTasks = newTasks;
          this.setTotalHoursForList('1');
          this.isLoaded++;
        });
      this.sprintService
        .getTasks('2', sprintId, this.story._id)
        .subscribe((inProgressTasks: Task[]) => {
          this.inProgressTasks = inProgressTasks;
          this.setTotalHoursForList('2');
          this.isLoaded++;
        });
      this.sprintService
        .getTasks('3', sprintId, this.story._id)
        .subscribe((doneTasks: Task[]) => {
          this.doneTasks = doneTasks;
          this.isLoaded++;
        });
    } else {
      this.newTasks = [];
      this.inProgressTasks = [];
      this.doneTasks = [];
    }
  }

  onTaskEdited(event) {
    const editedTask = event;
    if (editedTask.state === '1') {
      var taskToEdit = this.newTasks.find(
        (item) => item._id === editedTask._id
      );
      taskToEdit.hours = editedTask.hours;
    } else if (editedTask.state === '2') {
      var taskToEdit = this.inProgressTasks.find(
        (item) => item._id === editedTask._id
      );
      taskToEdit.hours = editedTask.hours;
    }

    this.setTotalHoursForList(editedTask.state);
  }

  removeDeletedTask(event) {
    console.log('Event id' + event._id);
    var deletedTask = event;
    if (deletedTask.state === '1') {
      this.newTasks = this.newTasks.filter(
        (item) => item._id !== deletedTask._id
      );
    } else if (deletedTask.state === '2') {
      this.inProgressTasks = this.inProgressTasks.filter(
        (item) => item._id !== deletedTask._id
      );
    } else if (deletedTask.state === '3') {
      this.doneTasks = this.doneTasks.filter(
        (item) => item._id !== deletedTask._id
      );
    }
    this.setTotalHoursForList(deletedTask.state);
  }

  setTotalHoursForList(listId: String) {
    var totalHours = 0;

    if (listId === '1') {
      this.newTasks.forEach((task) => {
        totalHours += task.hours;
      });
      this.totalHoursNew = totalHours;
    } else if (listId === '2') {
      this.inProgressTasks.forEach((task) => {
        totalHours += task.hours;
      });
      this.totalHoursInProgress = totalHours;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    var previousContainerId = event.previousContainer.id;
    var currentContainerId = event.container.id;
    var previousIndex = event.previousIndex;
    var currentIndex = event.currentIndex;

    this.updateDatabaseLists(
      previousContainerId,
      currentContainerId,
      previousIndex
    );

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.setTotalHoursForList(previousContainerId);
      this.setTotalHoursForList(currentContainerId);
      this.updateLocalLists(currentIndex, currentContainerId);
    }
  }

  onStoryDeleteClick() {
    this.storyDeleted.emit(this.story);
    this.sprintService
      .deleteStory(this.story._sprintId, this.story._id)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  onAddTaskClick() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      data: {
        sprintId: this.sprintId,
        storyId: this.story._id,
      },
    });

    dialogRef.afterClosed().subscribe((createdTask) => {
      if (createdTask) {
        this.newTasks.push(createdTask);
        this.setTotalHoursForList(createdTask.state);
      }
    });
  }

  updateLocalLists(currentIndex: number, currentContainerId: String) {
    if (currentContainerId === '1') {
      this.newTasks[currentIndex].state = currentContainerId;
    } else if (currentContainerId === '2') {
      this.inProgressTasks[currentIndex].state = currentContainerId;
    } else if (currentContainerId === '3') {
      this.doneTasks[currentIndex].state = currentContainerId;
    }
  }

  updateDatabaseLists(prevId: string, currId: string, itemIndex: number) {
    this.updateTaskState(prevId, currId, itemIndex);
  }

  updateTaskState(prevId: string, currId: string, itemIndex: number) {
    if (prevId === '1') {
      var itemToCreate = this.newTasks[itemIndex];
      itemToCreate.state = currId;
      this.sprintService
        .updateTaskState(
          currId,
          itemToCreate._sprintId,
          itemToCreate._storyId,
          itemToCreate._id
        )
        .subscribe((updatedTask: Task[]) => {
          console.log(updatedTask);
        });
    } else if (prevId === '2') {
      var itemToCreate = this.inProgressTasks[itemIndex];
      itemToCreate.state = currId;
      this.sprintService
        .updateTaskState(
          currId,
          itemToCreate._sprintId,
          itemToCreate._storyId,
          itemToCreate._id
        )
        .subscribe((updatedTask: Task[]) => {
          console.log(updatedTask);
        });
    } else if (prevId === '3') {
      var itemToCreate = this.doneTasks[itemIndex];
      itemToCreate.state = currId;
      this.sprintService
        .updateTaskState(
          currId,
          itemToCreate._sprintId,
          itemToCreate._storyId,
          itemToCreate._id
        )
        .subscribe((updatedTask: Task[]) => {
          console.log(updatedTask);
        });
    }
  }
}

import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

import { TaskPayload } from './../models/task-payload.model';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(private webService: WebRequestService) {}

  createSprint(title: string) {
    // Creates a web request to post a new sprint
    return this.webService.post('sprints', { title });
  }

  createStory(title: string, sprintId: String) {
    // Creates a web request to post a new sprint
    return this.webService.post(`sprints/${sprintId}/stories`, { title });
  }

  createTask(payload: TaskPayload, sprintId: String, storyId: String) {
    // Creates a web request to post a new Task
    const { title, assignedName, hours, state } = payload;

    return this.webService.post(
      `sprints/${sprintId}/stories/${storyId}/tasks/add`,
      { title, assignedName, hours, state }
    );
  }

  getSprints() {
    // Gets a web request with all sprints
    return this.webService.get('sprints');
  }

  getStories(sprintId: String) {
    // Gets a web request with the tasks assigned to the sprint
    return this.webService.get(`sprints/${sprintId}/stories`);
  }

  getTasks(state: string, sprintId: String, storyId: String) {
    // Gets a web request with the new tasks assigned to the sprint
    return this.webService.getByState(
      `sprints/${sprintId}/stories/${storyId}/tasks/get`,
      { state }
    );
  }

  updateSprint(title: String, sprintId: String) {
    // Updates a sprint with a new title
    return this.webService.patch(`sprints/${sprintId}`, { title });
  }

  updateStory(title: String, sprintId: String, storyId: String) {
    // Updates a story with a new title
    return this.webService.patch(`sprints/${sprintId}/stories/${storyId}`, {
      title,
    });
  }

  updateTask(
    payload: TaskPayload,
    sprintId: String,
    storyId: String,
    taskId: String
  ) {
    // Updates a task
    const { title, assignedName, hours, state } = payload;

    return this.webService.patch(
      `sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`,
      { title, assignedName, hours, state }
    );
  }

  updateTaskState(
    state: String,
    sprintId: String,
    storyId: String,
    taskId: String
  ) {
    // Updates a task with a new state
    return this.webService.patch(
      `sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`,
      { state }
    );
  }

  deleteSprint(sprintId: String) {
    // Deletes a sprint by ID
    return this.webService.delete(`sprints/${sprintId}`);
  }

  deleteStory(sprintId: String, storyId: String) {
    // Deletes a story by ID
    return this.webService.delete(`sprints/${sprintId}/stories/${storyId}`);
  }

  deleteTask(sprintId: String, storyId: String, taskId: String) {
    // Deletes a task by ID
    return this.webService.delete(
      `sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`
    );
  }
}

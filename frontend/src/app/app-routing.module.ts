import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryViewComponent } from './pages/story-view/story-view.component';
import { NewSprintComponent } from './pages/new-sprint/new-sprint.component';
import { NewStoryComponent } from './pages/new-story/new-story.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'sprints', pathMatch: 'full' },
  { path: 'new-sprint', component: NewSprintComponent },
  { path: 'sprints/:sprintId/new-story', component: NewStoryComponent },
  {
    path: 'sprints/:sprintId/stories/:storyId/new-task',
    component: NewTaskComponent,
  },
  { path: 'sprints', component: StoryViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sprints/:sprintId', component: StoryViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

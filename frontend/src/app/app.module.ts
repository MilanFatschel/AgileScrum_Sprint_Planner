import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { StoryViewComponent } from './pages/story-view/story-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewSprintComponent } from './pages/new-sprint/new-sprint.component';
import { NewStoryComponent } from './pages/new-story/new-story.component';
import { LoginComponent } from './pages/login/login.component';
import { WebRequestInterceptor } from './services/web-request.interceptor';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { StoryComponent } from './components/story/story.component';
import { TaskComponent } from './components/task/task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { DeleteSprintComponent } from './pages/delete-sprint/delete-sprint.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DeleteStoryComponent } from './pages/delete-story/delete-story.component';
import { SignUpSuccessComponent } from './pages/sign-up-success/sign-up-success.component';

@NgModule({
  declarations: [
    AppComponent,
    StoryViewComponent,
    NewSprintComponent,
    NewStoryComponent,
    LoginComponent,
    SignUpComponent,
    StoryComponent,
    TaskComponent,
    NewTaskComponent,
    EditTaskComponent,
    DeleteSprintComponent,
    WelcomeComponent,
    DeleteStoryComponent,
    SignUpSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    ScrollingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditTaskComponent],
})
export class AppModule {}

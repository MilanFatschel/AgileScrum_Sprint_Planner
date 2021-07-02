import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { WelcomeComponent } from 'src/app/pages/welcome/welcome.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorText: String = '';
  usernameInputText: String = '';
  passwordInputText: String = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(WelcomeComponent);
  }

  onLoginButtonClicked(username: string, password: string) {
    this.isLoading = true;
    this.authService
      .login(username, password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.message == 404) {
          this.isLoading = false;
          this.errorText = 'User not found. Please check your credentials.';
          return;
        } else if (res.status == 200) {
          this.isLoading = false;
          this.router.navigate(['/sprints']);
        }
      });
  }
}

import { Component, OnInit } from '@angular/core';

import { SignUpSuccessComponent } from 'src/app/pages/sign-up-success/sign-up-success.component';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  usernameInputText: String = '';
  passwordInputText: String = '';
  passwordVerifyInputText: String = '';
  errorText: String = '';
  minPasswordLength = 8;
  minUsernameLength = 4;

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  isPasswordMatch() {
    return (
      this.passwordInputText === this.passwordVerifyInputText &&
      this.passwordVerifyInputText.length > 0
    );
  }

  isPasswordValidated() {
    return this.passwordInputText.length >= this.minPasswordLength;
  }

  isUsernameValidated() {
    return this.usernameInputText.length >= this.minUsernameLength;
  }

  isFormValidated() {
    return (
      this.usernameInputText.length !== 0 &&
      this.passwordInputText.length !== 0 &&
      this.passwordVerifyInputText.length !== 0 &&
      this.isPasswordMatch() &&
      this.isPasswordValidated() &&
      this.isUsernameValidated()
    );
  }

  onSubmit(username: string, password: string) {
    this.authService
      .signup(username, password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status == 200) {
          console.log(res);
          const dialogRef = this.dialog.open(SignUpSuccessComponent);
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.errorText =
            'The username requested has already been taken. Please choose another.';
        }
      });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}

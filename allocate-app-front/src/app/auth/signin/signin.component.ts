import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  showErrorMessage: String = '';

  constructor(
    public authService: AuthService,
    public userService: UserService
  ){}

  ngOnInit(): void {
  }

  async signup(email: String, password: String) {
    this.showErrorMessage = '';

    await this.authService.signup(email, password)
    .then((result:any) => {
      if (result.errors && result.errors.length > 0) {
        this.showErrorMessage = result.errors[0].message;
      }
    })
    .catch(error =>{
      this.showErrorMessage = this.authService.translateErrorMessage(error);
    });
  }
}

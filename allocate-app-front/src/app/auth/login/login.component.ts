import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserService } from '../../services/user.service';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showErrorMessage: string = '';

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http:HttpClient,
    public authService: AuthService,
    public userService: UserService,
    public server: ServerService,
    public router: Router) 
  {}

  ngOnInit(): void {
  }

  async login(email: String, password: String) {
    this.showErrorMessage = '';

    this.showErrorMessage = await this.checkIfEmailExist(email);

    if(!this.showErrorMessage){
      await this.authService.login(email, password).catch(error => {
        this.showErrorMessage = this.authService.translateErrorMessage(error);
      });
    }
  }

  async checkIfEmailExist(email: String): Promise<string> {
      return  await this.authService.isEmailExistent(email)
        .then((isEmailUsed:any) => {
          if(!isEmailUsed) {
            return 'This account does not exist';
          }
          return '';
        })
        .catch((error:any) => {
          return this.authService.translateErrorMessage(error);
        })
  }
}

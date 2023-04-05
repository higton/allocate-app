import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserService } from '../../services/user.service';
import { ServerService } from '../services/server.service';
import { tokenName } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showErrorMessage: String;

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

  async login(username: String, password: String) {
    this.showErrorMessage = '';

    this.showErrorMessage = await this.checkIfUsernameExist(username);

    if(!this.showErrorMessage){
      await this.authService.login(username, password).catch(error => {
        this.showErrorMessage = this.authService.translateErrorMessage(error);
      });
    }
  }

  async checkIfUsernameExist(username: String){
      return  await this.authService.isUsernameExistent(username)
      .then( (existUsername:any) => {
        if(!existUsername) {
          return 'This account does not exist';
        }
      })
      .catch( (error:any) => {
        return this.authService.translateErrorMessage(error);
      })
  }
}

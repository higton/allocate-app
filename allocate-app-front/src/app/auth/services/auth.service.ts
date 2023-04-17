import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string;
  public user: {
    email: String,
  };
  
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private server: ServerService) {
    this.init();
  }

  async init() {
    let isLoggedIn = null;
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.token = user.token;
      this.server.setLoggedIn(true, this.token);

      isLoggedIn = await this.isLogged('/');
    }

    if(!isLoggedIn){
      this.logout();
    } else {
      this.loggedIn.next(true);

      // Save the email locally to avoid making a lot of requests to
      // the server
      if(!this.user){
        this.saveUserLocally();
      }
    }
  }

  async saveUserLocally(){
    let tmp:any = await this.getUserFromToken();
    this.user = tmp;
  }

  getEmail(): Promise<String>{
    return new Promise(async (resolve, reject) => {
      if(!this.user){
        let user:any = await this.getUserFromToken();
        resolve(user.email);
      } else {
        resolve(this.user.email)
      }
    });
  }

  getUserFromToken(){
    const query = `
      query{
        getUserFromToken{
          email,
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({ 
          query,
        })
      ).subscribe((response: any) => { 
        console.log('response', response);
        resolve(response.data.getUserFromToken);
      })
    });
  }

  signup(email: String, password: String) {
    let query = `mutation AddUser($email: String!, $password: String!) {
      addUser(email: $email, password: $password)
    }`;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({
          query,
          variables: { email, password },
        })
      ).subscribe(
        async (response: any) => {
          if(!response.errors){
            await this.login(email, password);
          }
          console.log('response', response);
          resolve(response);
        },
        async (error: any) => {
          console.log('error', error);
          reject(error);
        }
      );
    })
  }

  login(email: String, password: String) {
    let token = '';

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/api/authenticate', {
        email: email,
        password: password
      }).subscribe(
        async (response: any) => {
          console.log('response', response);
          if(response.auth === true && response.token !== undefined) {
            token = response.token;
            this.server.setLoggedIn(true, token);
            this.loggedIn.next(true);
            let tmp:any = await this.getUserFromToken();
            this.user = tmp;

            const userData = {
              token: token,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            this.router.navigate(['home']);
          }
          resolve(response);
         },
        (err:any) => {
          console.log('error', err);
          reject(err);
        }
      )
    });
  }

  logout() {
    return new Promise<void>((resolve, reject) => {
      this.server.setLoggedIn(false);
      delete this.token;
      delete this.user;

      this.loggedIn.next(false);
      localStorage.clear();
      this.router.navigate(['/']);
      resolve();
    });
  }

  checkToken(){
    return this.server.request('GET', '/checkToken').subscribe((response) => {
      console.log('response', response);
    })
  }

  isLogged(url): any {
    return new Promise((resolve, reject) => {
      this.server.request('GET', '/checkToken')
        .subscribe(
          (response) => {
            console.log('response', response);
            resolve(true);
          },
          (err) => {
            // Store the attempted URL for redirecting
            this.redirectUrl = url;

            console.log('error', err);
            resolve(false);
          }
        );
    });
  }

  isCorrectPassword(password: String){
    const query = `
      query isCorrectPassword($password: String!){
        isCorrectPassword(password: $password)
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({ 
          query,
          variables: { password },
        })
      ).subscribe(
        (response: any) => { 
          console.log('response', response);
          if(response.data.isCorrectPassword){
            resolve(true);
          } else {
            console.log('erros: ', response.errors[0].message);
            resolve(false);
          }
        },
        (err) => { 
          console.log('error', err);
          reject(err);
        }
       )
    });
  }

  changePassword(email: String, newPassword: String){
    let query = `mutation changePassword($email: String!, $newPassword: String!) {
      changePassword(email: $email, newPassword: $newPassword)
    }`;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({
          query,
          variables: { email, newPassword },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve()
      })
    });
  }

  isEmailExistent(email: String){
    const query = `
      query checkEmail($email: String!){
        checkEmail(email: $email)
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({ 
          query,
          variables: { email },
        })
      ).subscribe(
        (response: any) => { 
          console.log('response', response);
          if(response.data.checkEmail){
            resolve(true);
          } else {
            console.log('erros: ', response);
            resolve(false);
          }
        },
        (err) => { 
          console.log('error', err);
          reject(err);
        })
    });
  }

  translateErrorMessage(error: any){
    if(error.statusText === "Unauthorized"){
      return 'Wrong password';
    }
    if(error.statusText === "Unknown Error"){
      return 'No connection with the server';
    }
  }
}
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
    username: String,
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

      // Save the username locally to avoid making a lot of requests to
      // the server
      if(!this.user){
        this.saveUsernameLocally();
      }
    }
  }

  async saveUsernameLocally(){
    let tmp:any = await this.getUserFromToken();
    this.user = tmp;
  }

  getUsername():any{
    return new Promise(async (resolve, reject) => {
      if(!this.user){
        let user:any = await this.getUserFromToken();
        resolve(user.username);
      } else {
        resolve(this.user.username)
      }
    });
  }

  getUserFromToken(){
    const query = `
      query{
        getUserFromToken{
          username,
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

  signup(username: String, password: String) {
    let query = `mutation AddUser($username: String!, $password: String!) {
      addUser(username: $username, password: $password)
    }`;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({
          query,
          variables: { username, password },
        })
      ).subscribe(
        async (response: any) => {
          if(!response.errors){
            await this.login(username, password);
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

  login(username: String, password: String) {
    let token = '';

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/api/authenticate', {
        username: username,
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

            console.log('erro', err);
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


  deleteAccount(username: String){
    let query = `mutation deleteUser($username: String!) {
      deleteUser(username: $username)
    }`;

    this.server.request('POST', '/graphql', 
      JSON.stringify({
        query,
        variables: { username },
      })
    ).subscribe((response: any) => {
      console.log('response', response);
      this.server.setLoggedIn(false);
      delete this.token;
      delete this.user;
  
      this.loggedIn.next(false);
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

  changePassword(username: String, newPassword: String){
    let query = `mutation changePassword($username: String!, $newPassword: String!) {
      changePassword(username: $username, newPassword: $newPassword)
    }`;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({
          query,
          variables: { username, newPassword },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve()
      })
    });
  }

  isUsernameExistent(username: String){
    const query = `
      query checkUsername($username: String!){
        checkUsername(username: $username)
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql', 
        JSON.stringify({ 
          query,
          variables: { username },
        })
      ).subscribe(
        (response: any) => { 
          console.log('response', response);
          if(response.data.checkUsername){
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
    if(error === "This username already exist"){
      return 'This username already exist';
    }
  }
}

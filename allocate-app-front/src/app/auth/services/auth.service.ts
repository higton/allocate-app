import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ServerService } from './server.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';

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

  addCourseToAccount(course_name: String, course_class_number: Number, course_number_of_students: Number, account_email: String){
    let query = `mutation addCourseToAccount($course_name: String!, $course_class_number: Int!, $course_number_of_students: Int!, $account_email: String!) {
      addCourseToAccount(course_name: $course_name, course_class_number: $course_class_number, course_number_of_students: $course_number_of_students, account_email: $account_email)
    }`;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { course_name, course_class_number, course_number_of_students, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => { 
        console.log('error', err);
        reject(err);
      })
    });
  }

  getCoursesFromAccount(email: String): Promise<Course[]>{
    const query = `
      query getCoursesFromAccount($email: String!){
        getCoursesFromAccount(email: $email) {
          name,
          class_number,
          number_of_students
        }
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
          resolve(response.data.getCoursesFromAccount);
        },
        (err) => {
          console.log('error', err);
          reject(err);
        })
    });
  }

  removeCourseFromAccount(course_name: String, course_class_number: Number, account_email: String){
    const query = `
      mutation removeCourseFromAccount($course_name: String!, $course_class_number: Int!, $account_email: String!) {
        removeCourseFromAccount(course_name: $course_name, course_class_number: $course_class_number, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { course_name, course_class_number, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  // create function fro this query editCourseFromAccount(account_email: String!, course_name: String!, course_class_number: Int!, course_number_of_students: Int!}: String,
  editCourseFromAccount(account_email: String, course_name: String, course_class_number: Number, course_number_of_students: Number){
    const query = `
      mutation editCourseFromAccount($account_email: String!, $course_name: String!, $course_class_number: Int!, $course_number_of_students: Int!) {
        editCourseFromAccount(account_email: $account_email, course_name: $course_name, course_class_number: $course_class_number, course_number_of_students: $course_number_of_students)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { account_email, course_name, course_class_number, course_number_of_students },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  addClassroomToAccount(classroom_name: String, classroom_number_of_seats: Number, account_email: String){
    const query = `
      mutation addClassroomToAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $account_email: String!) {
        addClassroomToAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name, classroom_number_of_seats, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  removeClassroomFromAccount(classroom_name: String, account_email: String){
    const query = `
      mutation removeClassroomFromAccount($classroom_name: String!, $account_email: String!) {
        removeClassroomFromAccount(classroom_name: $classroom_name, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  editClassroomFromAccount(classroom_name: String, classroom_number_of_seats: Number, account_email: String){
    const query = `
      mutation editClassroomFromAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $account_email: String!) {
        editClassroomFromAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name, classroom_number_of_seats, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  getClassroomsFromAccount(email: String): Promise<Classroom[]>{
    const query = `
      query getClassroomsFromAccount($email: String!) {
        getClassroomsFromAccount(email: $email) {
          name
          number_of_seats
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);
        resolve(response.data.getClassroomsFromAccount);
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

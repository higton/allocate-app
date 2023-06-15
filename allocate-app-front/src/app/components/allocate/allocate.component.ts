import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.css']
})
export class AllocateComponent implements OnInit {
  htmlResponse: SafeHtml = '';
  solutions: string[] = ['ensaleitor'];

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void { 
    this.updateSolutions();
  }

  async updateSolutions() {
    let result_solutions = await this.userService.getSolutions();

    // add new solutions to the list
    for (let solution of result_solutions) {
      if (!this.solutions.includes(solution)) {
        this.solutions.push(solution);
      }
    }
  }

  redirect(solution: string) {
    this.router.navigateByUrl(`home/allocate/${solution}`);
  }
}

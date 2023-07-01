import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServerService } from '../../../auth/services/server.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public server: ServerService,
    public authService: AuthService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init(){
    let email:String = await this.authService.getEmail();
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  goToClassroomsPage(){
    this.router.navigate(['/home/classrooms']);
  }

  goToCoursesPage(){
    this.router.navigate(['/home/courses']);
  }

  goToAllocationPage(){
    this.router.navigate(['/home/allocate']);
  }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }

  goToSignUpPage(){
    this.router.navigate(['/signup']);
  }

  goToProfilePage(){
    this.router.navigate(['/editProfile']);
  }

  async logout(){
    await this.authService.logout();
  }
}

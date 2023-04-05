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

    this.userService.getUpdateProfilePictureEvent().subscribe(() => {
      this.init();
    });
  }

  async init(){
    let username:any = await this.authService.getUsername();
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  goToSetsPage(){
    this.router.navigate(['/sets']);
  }

  goToAllCardsPage(){
    this.router.navigate(['/cards/page/1']);
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
    this.userService.sendUpdateProfilePictureEvent();
  }
}

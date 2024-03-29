import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  showErrorMessage: string = '';
  showSuccessMessage: String = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  async changePassword(oldPassword: String, newPassword: String, reEnterPassword: String){
    this.showErrorMessage = '';
    let email:String = await this.authService.getEmail();
    let isCorrectPassword:boolean = false;

    if(newPassword !== reEnterPassword){
      this.showErrorMessage = 'The passwords do not match';
    } else {
    	await this.authService.isCorrectPassword(oldPassword)
        .then(async (result:any) => {
          isCorrectPassword = result;

          if(!isCorrectPassword){
            this.showErrorMessage = 'Wrong password';
          } else {
            this.authService.changePassword(email, newPassword)
            .then(result => {
              this.showSuccessMessage = 'Password changed successfully!';
            });

          }
        })
        .catch((error:any) => {
          this.showErrorMessage = this.authService.translateErrorMessage(error);
        });
  	}
  }
}

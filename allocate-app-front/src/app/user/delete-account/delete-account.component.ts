import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  showErrorMessage: String;

  constructor(
  	public authService: AuthService,
  	) { }

  ngOnInit(): void {
  }

  async deleteAccount(password){
    this.showErrorMessage = '';
    let username:any = await this.authService.getUsername();
  	let isCorrectPassword = false;

    await this.authService.isCorrectPassword(password)
    .then((result:boolean) => {
      isCorrectPassword = result;

      if(!isCorrectPassword){
        this.showErrorMessage = 'Wrong password';
      }
    })
    .catch((error:any) => {
      this.showErrorMessage = this.authService.translateErrorMessage(error);
    })

  	if(isCorrectPassword){
  		this.authService.deleteAccount(username);
  	}
  }
}

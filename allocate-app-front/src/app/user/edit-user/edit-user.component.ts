import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(
  	public authService: AuthService,
  	) { }

  ngOnInit(): void {
  }
}

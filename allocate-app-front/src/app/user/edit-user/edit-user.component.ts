import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';
import { Course } from '../../models/Course';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {}
}

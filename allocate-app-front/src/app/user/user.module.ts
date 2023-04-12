import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [UserComponent, EditUserComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }

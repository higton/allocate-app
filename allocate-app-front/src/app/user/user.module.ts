import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';


@NgModule({
  declarations: [UserComponent, EditUserComponent, ChangePasswordComponent, DeleteAccountComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }

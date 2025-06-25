import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './createUser/createUser.component';
import { UserListComponent } from './userList/userList.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, CreateUserComponent, UserListComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  activeTab = 'list';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}

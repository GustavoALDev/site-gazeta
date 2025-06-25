import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../env/env';
import { User } from '@site-gazeta/models';
  
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/user`;

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
}

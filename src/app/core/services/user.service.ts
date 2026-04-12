import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environments";
import { User } from "../../shared/models/user.model";


@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/user`; // Tu endpoint de usuarios

  register(userData: any) {
    return this.http.post<User>(this.baseUrl, userData);
  }
}
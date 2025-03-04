import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// review after => create a models folder
export interface Employee {
  id: number; 
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dob: string; 
  salary: number;
  address: string;
  contactNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://retoolapi.dev/HYd96h/data'; 

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
}

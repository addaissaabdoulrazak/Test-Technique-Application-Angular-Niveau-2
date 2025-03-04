import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';  // Ajouté
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService, Employee } from '../../services/employee.service';
import { delay, take } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatPaginatorModule,
    MatTableModule, 
    MatSortModule,  
    MatProgressSpinnerModule, 
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'age', 'salary', 'actions'];;
  pageSizeOptions: number[] = [5, 10, 20, 25, 50];

  pageIndex: number = 0; 
  pageSize: number = 10;  
  length: number = 0;  

  dataSource!: MatTableDataSource<Employee>; 
  newEmployee: Partial<Employee> = {};
  showAddForm: boolean = false;
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {

      // this.dataSource = new MatTableDataSource();
      // this.loadData();
      this.dataSource = new MatTableDataSource();
      this.loading = true; 
      setTimeout(() => {
        this.loadData();
      }, 3000); 

  }

  // check it
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  

  loadData() {
    this.loading = true;
    
    this.employeeService.getEmployees()
      .pipe(take(1)) 
      .subscribe({
        next: (results) => {
          if (results) { 
            this.dataSource.data = results;       
          }
          
          this.loading = false;

        },
        error: (err) => {
          console.error('Erreur API:', err);
          this.loading = false;
          
        }
      });
      this.loading = false;
  }
 
  filterData(filterValue: string) {
    
    filterValue = filterValue.trim().toLowerCase(); 
  
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
      
      this.dataSource.filter = filterValue;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterData(filterValue); 
  }

  deleteEmployee(id: number) { 
    this.dataSource.data = this.dataSource.data.filter(emp => emp.id !== id);
  }

  addEmployee() {
    if (
      !this.newEmployee.firstName?.trim() ||
      !this.newEmployee.lastName?.trim() ||
      !this.newEmployee.email?.trim() ||
      this.newEmployee.age == null ||
      this.newEmployee.salary == null
  ) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
  }
    const newId = this.dataSource.data.length + 1;
    this.dataSource.data = [...this.dataSource.data, { ...this.newEmployee, id: newId } as Employee]; 
    this.showAddForm = false;
    this.newEmployee = {};
  }

  // onPageChange(event: any) {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadData();  
  // }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';  // Ajouté
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService, Employee } from '../../services/employee.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
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
  loading = false;
  isLoading: boolean = false;
  showAddForm: boolean = false;
  @ViewChild('employeeForm') employeeForm: NgForm | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

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

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.filterData(filterValue); 
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.dataSource.filter = filterValue;
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  applyFilter(event: Event) {
    this.isLoading = true;  // Active le spinner
  
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  
   
    setTimeout(() => {
      this.isLoading = false;  
    }, 500);  
  }

  deleteEmployee(id: number) {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: "Êtes-vous sûr de vouloir supprimer cet employé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(emp => emp.id !== id);
        Swal.fire('Supprimé !', 'L\'employé a été supprimé.', 'success');
      }
    });
  }



  // onPageChange(event: any) {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadData();  
  // }

//--Check here 

addEmployee() {
  if (!this.newEmployee.firstName || !this.newEmployee.lastName || !this.newEmployee.email) {
    Swal.fire({
      icon: 'error',
      title: 'Champs manquants',
      text: 'Veuillez remplir tous les champs obligatoires.',
    });
    return;
  }

  const newId = Date.now();
  const newEmployeeData = { ...this.newEmployee, id: newId } as Employee;
  this.dataSource.data = [...this.dataSource.data, newEmployeeData];


  this.dataSource._updateChangeSubscription();

  this.closeModal();

  Swal.fire({
    icon: 'success',
    title: 'Employé ajouté !',
    text: 'L\'employé a été enregistré avec succès.',
    timer: 2000,
    showConfirmButton: false,
  });
}
//

closeModal() {
  this.showAddForm = false;
  this.newEmployee = {};  //--

  //--
  if (this.employeeForm) {
    this.employeeForm.resetForm();
  }
}

//
  //--modal
  openEmployeeDialog(employee?: any): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: { employee: employee ? { ...employee } : {} }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          // Modification de l'employé existant
          const index = this.dataSource.data.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource._updateChangeSubscription();
          }
        } else {
          // Ajout d'un nouvel employé
          result.id = Date.now();
          this.dataSource.data = [...this.dataSource.data, result];
        }
      }
    });
  }
  

}

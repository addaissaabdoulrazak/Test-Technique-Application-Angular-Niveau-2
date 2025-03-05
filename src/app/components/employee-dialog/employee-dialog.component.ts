import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,     
    MatButtonModule,    
             
  ],
  template: `
    <h2 mat-dialog-title>{{ data.employee ? 'Modifier' : 'Ajouter' }} un Employé</h2>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Prénom" [(ngModel)]="data.employee.firstName" required>
      </mat-form-field>

      <mat-form-field>
        <input matInput placeholder="Nom" [(ngModel)]="data.employee.lastName" required>
      </mat-form-field>

      <mat-form-field>
        <input matInput placeholder="Email" [(ngModel)]="data.employee.email" required>
      </mat-form-field>

      <mat-form-field>
        <input matInput placeholder="Âge" [(ngModel)]="data.employee.age" type="number" required>
      </mat-form-field>

      <mat-form-field>
        <input matInput placeholder="Salaire" [(ngModel)]="data.employee.salary" type="number" required>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">Annuler</button>
      <button mat-button color="primary" (click)="save()">Enregistrer</button>
    </div>
  `
})
export class EmployeeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: any }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data.employee);
  }
}

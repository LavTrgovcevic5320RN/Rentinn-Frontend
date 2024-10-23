import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {

  newValue: string;
  showPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.newValue = data.value; // Initialize the value for editing
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onCancel(): void {
    this.dialogRef.close(); // Close without saving changes
  }

  onSave(): void {
    this.dialogRef.close(this.newValue); // Close and pass the new value back
  }
}

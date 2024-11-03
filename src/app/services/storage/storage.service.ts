import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private formState = new BehaviorSubject<FormGroup | null>(null);
  formState$ = this.formState.asObservable();
  private isProgrammaticUpdate = false;

  constructor(private fb: FormBuilder) {
    const savedForm = localStorage.getItem('searchForm');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      this.formState.next(this.fb.group({
        destination: [parsedForm.destination || ''],
        checkIn: [parsedForm.checkIn || ''],
        checkOut: [parsedForm.checkOut || ''],
        roomsGuests: [parsedForm.roomsGuests || '']
      }));
    } else {
      const initialForm = this.fb.group({
        destination: ['', Validators.required],
        checkIn: ['', Validators.required],
        checkOut: ['', Validators.required],
        roomsGuests: ['', Validators.required]
      });
      this.formState.next(initialForm);
    }
  }

  updateForm(newFormValue: any): void {
    const currentForm = this.formState.value;
    if (currentForm) {
      this.isProgrammaticUpdate = true;
      currentForm.patchValue(newFormValue);
      this.formState.next(currentForm);

      localStorage.setItem('searchForm', JSON.stringify(currentForm.value));

      this.isProgrammaticUpdate = false;
    }
  }

  getForm(): FormGroup | null {
    return this.formState.value;
  }
}

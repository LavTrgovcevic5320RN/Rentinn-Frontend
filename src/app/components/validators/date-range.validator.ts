import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const checkIn = control.get('checkIn')?.value;
    const checkOut = control.get('checkOut')?.value;

    if (!checkIn || !checkOut) {
      return null; // Skip validation if either date is missing
    }

    // Check if checkIn is after or equal to checkOut
    if (new Date(checkIn) >= new Date(checkOut)) {
      return { dateRangeInvalid: true };
    }

    return null; // Valid if checkIn is before checkOut
  };
}

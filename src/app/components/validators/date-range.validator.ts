import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const checkIn = control.get('checkIn')?.value;
    const checkOut = control.get('checkOut')?.value;

    if (!checkIn || !checkOut) {
      return null;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return { dateRangeInvalid: true };
    }

    return null;
  };
}

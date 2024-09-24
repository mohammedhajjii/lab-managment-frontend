import {AbstractControl, ValidatorFn, Validators} from "@angular/forms";
import {DateTime} from "luxon";


export type BiControlValidatorFn = (other: AbstractControl, start: boolean) => ValidatorFn;

export class DateTimeValidators {

  static startTime: ValidatorFn = control => {
    const startTimeValue = DateTime.fromFormat(control.value, 'HH:mm');
    if (startTimeValue.hour < 8 || startTimeValue.hour > 19)
      return {startTime: true};
    return null;
  };

  static endTime: ValidatorFn = control => {
    const endTimeValue = DateTime.fromFormat(control.value, 'HH:mm');
    if (endTimeValue.hour < 9 || endTimeValue.hour > 20 )
      return {endTime: true};
    return null;
  };

  static maxDuration: BiControlValidatorFn = (other, start) => {
    return control => {

      const startTime =
        DateTime.fromFormat(start ? control.value : other.value, 'HH:mm');

      const endTime =
        DateTime.fromFormat(start ? other.value : control.value, 'HH:mm');

      if (endTime.diff(startTime).as('minutes') > 180)
        return {maxDuration: true};

      return null;
    }
  }

  static startAfterEnd: BiControlValidatorFn = other => {
    return control => {
      const startTimeValue =
        DateTime.fromFormat(control.value, 'HH:mm');

      const endTimeValue =
        DateTime.fromFormat(other.value, 'HH:mm');


      if (endTimeValue.diff(startTimeValue).as('millisecond') < 0)
        return {startAfterEnd: true};

      return null;
    }
  }

  static endBeforeStart: BiControlValidatorFn = other => {
    return control => {

      const endTimeValue =
        DateTime.fromFormat(control.value, 'HH:mm');

      const startTimeValue =
        DateTime.fromFormat(other.value, 'HH:mm');


      if (endTimeValue.diff(startTimeValue).as('millisecond') < 0)
        return {endBeforeStart: true};

      return null;
    }
  }

  static reservationDate: ValidatorFn = control => {

    const dateValue = DateTime.fromJSDate(control.value);

    const hours: number = dateValue.diff(DateTime.now()).as('hours');

    if (hours < 48) {
      console.log('error has been caught');
      return {reservationDate: true};
    }

    return null;
  }
}



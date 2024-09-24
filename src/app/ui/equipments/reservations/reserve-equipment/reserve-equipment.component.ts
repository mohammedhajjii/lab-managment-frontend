import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateTime} from "luxon";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EquipmentReservationFormGroup, getControl} from "../../../../utils/controls.template";
import {DateTimeValidators} from "../../../../validators/dateTime.validators";

@Component({
  selector: 'app-reserve-equipment',
  templateUrl: './reserve-equipment.component.html',
  styleUrl: './reserve-equipment.component.css'
})
export class ReserveEquipmentComponent implements OnInit, AfterViewInit{


  formGroup!: FormGroup<EquipmentReservationFormGroup>;

  get date(): FormControl<Date>{
    return getControl(this.formGroup, 'date');
  }

  get startTime(): FormControl<string>{
    return getControl(this.formGroup, 'startTime');
  }

  get endTime(): FormControl<string>{
    return getControl(this.formGroup, 'endTime');
  }

  get description(): FormControl<string>{
    return getControl(this.formGroup, 'description');
  }


  ngOnInit(): void {

    this.formGroup = new FormGroup<EquipmentReservationFormGroup>({
      date: new FormControl<Date>(null, {
        validators: [Validators.required]
      }),
      startTime: new FormControl<string>(null, {
      validators: [
        Validators.required,
      ]
      }),
      endTime: new FormControl<string>(null, {
        validators: [
          Validators.required,
        ]
      }),
      description: new FormControl<string>(null, {
        validators: [Validators.required]
      })
    });


  }

  ngAfterViewInit(): void {
    this.date.addValidators(DateTimeValidators.reservationDate);
    this.startTime.addValidators([
      DateTimeValidators.startTime,
      DateTimeValidators.startAfterEnd(this.endTime, true),
      DateTimeValidators.maxDuration(this.endTime, true)
    ]);
    this.endTime.addValidators([
      DateTimeValidators.startTime,
      DateTimeValidators.startAfterEnd(this.startTime, false),
      DateTimeValidators.maxDuration(this.startTime, false)
    ])
  }

  logDate(datepicker: MatDatepickerInputEvent<any, any>) {
    const date =
      DateTime.fromJSDate(datepicker.value);


    console.log('2: ' + date.toISODate());
  }



}

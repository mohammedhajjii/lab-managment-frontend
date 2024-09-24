import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateTime} from "luxon";

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrl: './date.component.css'
})
export class DateComponent {

  @Input() control!: FormControl<Date>;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() width: string = '100%';

  readonly dateFilter: (date: Date) => boolean = date => {
    const dateTime = DateTime.fromJSDate(date);
    const durationFromNow = dateTime.diff(DateTime.now()).as('days');
    return !dateTime.isWeekend && (durationFromNow > 0);
  }

}

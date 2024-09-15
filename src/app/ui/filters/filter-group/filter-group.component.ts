import {Component, Input, OnInit, Output} from '@angular/core';
import {FilterGroup, FilterGroupData, FilterGroupMap, SubscriberMap} from "../../../utils/filters.utils";
import {distinctUntilChanged, Subject} from "rxjs";

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrl: './filter-group.component.css'
})
export class FilterGroupComponent<T extends FilterGroupMap<T>> implements OnInit{

  @Input() filterGroup!: FilterGroup<T>;
  @Input() subscriberMap!: SubscriberMap<T>;
  @Output() valueChanges: Subject<FilterGroupData<T>> =
    new Subject<FilterGroupData<T>>();


  ngOnInit(): void {
    //listening to the change event:
    this.filterGroup.formGroup.valueChanges
      .pipe(
        distinctUntilChanged((previous, current) =>
          JSON.stringify(previous) === JSON.stringify(current))
      )
      .subscribe({
        next: (values: FilterGroupData<T>) => {
          this.valueChanges.next(values);
        }
      });

    //subscribe:
    Object.entries<keyof T>(this.subscriberMap)
      .forEach(entry => {

        if (this.filterGroup.contains(entry[1] as string)){

          this.filterGroup.getFilterControl(entry[0] as keyof T)
            .subscribe(this.filterGroup.getFilterControl(entry[1]));
        }
      });
  }



}

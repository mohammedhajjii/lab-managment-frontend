import {Component, Input, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  @Output() onSearchKeyword: Subject<string> = new Subject<string>();
  keywordFormControl: FormControl<string> = new FormControl('');

  ngOnInit(): void {
    this.keywordFormControl.valueChanges
      .subscribe({
        next: value => {
          this.onSearchKeyword.next(value);
        }
      });
  }

  public reset(): void{
    this.keywordFormControl.reset('');
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fragment',
  templateUrl: './fragment.component.html',
  styleUrl: './fragment.component.css'
})
export class FragmentComponent implements OnInit{

  @Input() fragments!: FragmentDetails[];

  activatedFragment!: string;
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activatedRoute.fragment.subscribe({
      next: fragment => {
        this.activatedFragment = fragment;
      }
    });
  }


  isActive(fragment: string) : boolean{
    return this.activatedFragment === fragment;
  }

}

export interface FragmentDetails {
  id: string;
  label: string;
}

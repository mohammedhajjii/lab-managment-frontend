import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {PasswordService} from "./services/password.service";
import {Profile} from "./models/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'front-end';

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {

    this.userService.getUserById('004a9146-3715-452b-b664-d1b4aba42fab')
      .subscribe({
        next: user => {
         user.alter({email: 'test@test,com'});
          console.log(user);
        }
      })

  }
}


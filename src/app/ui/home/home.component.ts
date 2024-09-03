import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

  constructor(private userService: UserService) {
  }

  createUser() {

  }
}

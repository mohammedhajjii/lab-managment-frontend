import { Injectable } from '@angular/core';
import {generate} from 'generate-password-browser'

@Injectable({
  providedIn: 'root'
})
export class PasswordService {



  constructor() { }


  generatePassword(): string{
    return generate({
      length: 10,
      lowercase: true,
      uppercase: true,
      symbols: false,
      numbers: true
    })
  }

}

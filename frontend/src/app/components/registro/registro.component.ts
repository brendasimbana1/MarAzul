import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  user = {
    nombre: '', 
    cedula: '', 
    email: '', 
    password: ''
  }
  @ViewChild('reg') reg!: NgForm;
  singUp(){
    this.authService.singUp(this.user)
    .subscribe(
      res => {
        console.log(res)
        //localStorage.setItem('token', res.token);
        alert('Usuario registrado');
        this.router.navigate(['/home'])
      },
      err => console.log(err)
    )
  }
  constructor(private authService:AuthService,
    private router:Router
  ){}
}

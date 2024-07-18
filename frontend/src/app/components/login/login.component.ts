import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    email: '',
    password:''
  }
  @ViewChild('login') login!: NgForm;

  signIn(): void {
    this.authService.signIn(this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/pedido']);
        },
        err => {
          console.error(err);
          if (err.status === 401) {
            alert('Credenciales incorrectas. Inténtelo de nuevo.');
            if(this.login){
              this.login.resetForm();
            } 
          }
        }
      );
  }
  constructor(private authService:AuthService,
    private router:Router
  ){}
}

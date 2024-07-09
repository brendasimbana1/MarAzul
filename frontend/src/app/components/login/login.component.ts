import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';

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
          }
        }
      );
  }
  constructor(private authService:AuthService,
    private router:Router
  ){}
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrl: './barra.component.css'
})
export class BarraComponent {
  constructor(public authService: AuthService ){}
  title = 'frontend';
}

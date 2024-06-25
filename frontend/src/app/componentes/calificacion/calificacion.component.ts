import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrl: './calificacion.component.css'
})
export class CalificacionComponent {
  waiterName: string = '';
  rating: number = 0;
  comment: string = '';

  constructor(private http: HttpClient) {}

  enviarCalificacion() {
    const calificacion = {
      waiterName: this.waiterName,
      rating: this.rating,
      comment: this.comment
    };

    this.http.post('/api/calificacion', calificacion).subscribe(response => {
      console.log('Calificación enviada:', response);
    });
  }
}

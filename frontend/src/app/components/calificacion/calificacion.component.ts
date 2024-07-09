import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TasksService } from '../../services/tasks.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrl: './calificacion.component.css'
})
export class CalificacionComponent {
  waiterName: string = '';
  rating: number = 0;
  comment: string = '';
  @ViewChild('cali') cali!: NgForm;

  constructor(private tasksService: TasksService) {}

  enviarCalificacion() {
    const data = {
      waiterName: this.waiterName,
      rating: this.rating,
      comment: this.comment
    };

    this.tasksService.calificacion(data)
    .subscribe(
      (response) => {
        console.log('Calificación guardada correctamente:', response);
        if(this.cali){
          this.cali.resetForm();
        } 
        alert('Calificación guardada correctamente.');  
      },
      (error) => {
        console.error('Error al guardar calificación:', error);
      }
    );
  }
}

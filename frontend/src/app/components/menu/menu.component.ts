import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TasksService } from '../../services/tasks.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  menu: any[] = [];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getMenu()
    .subscribe(
      res=>{
        console.log(res)
        this.menu = res;
      }
    )
  }

  agregarAlPedido(plato: any): void {
    console.log('Plato agregado al pedido:', plato);
  }
}

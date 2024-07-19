import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.tasksService.getPedidos().subscribe(
      data => {
        this.pedidos = data;
      },
      error => {
        console.error('Error al cargar los pedidos', error);
      }
    );
  }

  deletePedido(id: string): void {
    
    if(confirm('¿Estás seguro?')){

    
    this.tasksService.deletePedido(id).subscribe(
      () => {
        this.pedidos = this.pedidos.filter(pedido => pedido._id !== id);
      },
      error => {
        console.error('Error al eliminar el pedido', error);
      }
    );
  }
  }
}
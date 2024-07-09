import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var M: any;

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, AfterViewInit {
  pedidosForm: FormGroup;
  pedidos: any[] = [];
  menuItems: any[] = [];

  constructor(private tasksService: TasksService, private el: ElementRef, private fb: FormBuilder) {
    this.pedidosForm = this.fb.group({
      menuItem: ['', Validators.required],
      cliente: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  ngAfterViewInit() {
    M.AutoInit(); // Inicializa todos los componentes de Materialize en la vista actual
  }

  loadMenuItems(): void {
    this.tasksService.getMenu().subscribe((data: any) => {
      this.menuItems = data;
      console.log('Menu Items:', this.menuItems);
      setTimeout(() => {
        const selectElements = this.el.nativeElement.querySelectorAll('select');
        M.FormSelect.init(selectElements, {});
      }, 0); // Inicializa Materialize select después de que la vista se haya actualizado
    });
  }

  createPedido(): void {
    if (this.pedidosForm.valid) {
      const formData = this.pedidosForm.value;
      const selectedMenuItem = this.menuItems.find(item => item._id === formData.menuItem);
  
      if (selectedMenuItem) {
        const productos = [
          {
            menuItem: selectedMenuItem._id,
            cantidad: formData.cantidad
          }
        ];
  
        const newPedido = {
          cliente: formData.cliente,
          productos: productos,
          total: calcularTotal(productos) // Calcula el total aquí según tu lógica
        };
  
        this.tasksService.createPedido(newPedido).subscribe(
          pedido => {
            this.pedidos.push(pedido);
            console.log('Pedido creado:', pedido);
            // Reiniciar el formulario después de crear el pedido
            this.pedidosForm.reset();
            alert(`Valor a Pagar: ${pedido.total.toFixed(2)}`);
          },
          error => {
            console.error('Error al crear pedido:', error);
            // Manejo de errores: Mostrar un mensaje al usuario o realizar otra acción apropiada
          }
        );
      } else {
        console.error('Error: Producto no encontrado en menuItems');
      }
    }
  }
  
  // Función para calcular el total basado en los productos del pedido 
 
}
function calcularTotal(productos: any[]): number {
  let total = 0;
  productos.forEach(producto => {
    total += producto.cantidad * producto.menuItem.price; // Ajusta según la estructura de tu MenuItem
  });
  return total;
} 
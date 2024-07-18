import { Component, OnInit } from '@angular/core';
import { Platillo } from '../../models/platillo';
import { TasksService } from '../../services/tasks.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  products: Platillo[] = [];
  orderForm: FormGroup;

  constructor(
    private ts: TasksService,
    private fb: FormBuilder,
  
  ) {
    this.orderForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.ts.getMenu().subscribe(data => {
      this.products = data;
      console.log(this.products);
      console.log('aaa');
      this.initializeForm();
    });
  }

  initializeForm() {
    this.orderForm.setControl('items', this.fb.array(this.products.map(product => this.createItem(product))));
  }

  createItem(product: Platillo): FormGroup {
    return this.fb.group({
      nombre: [product.name],
      precio: [product.price],
      cantidad: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  onSubmit() {
    const formValue = this.orderForm.value;
    const order = {
      products: formValue.items,
      total: formValue.items.reduce((acc: number, item: { precio: number; cantidad: number }) => acc + item.precio * item.cantidad, 0)
    };
    this.ts.getUserName().subscribe(
      data => {
        this.ts.placeOrder(order).subscribe(
      
          response => {
            console.log('Order placed successfully', response);
            console.log(order.total);
            alert(`¡El pedido ha sido realizado con éxito!. Nombre: ${data.name}. Valor a Pagar: ${order.total.toFixed(2)}`);
            this.initializeForm();
          },
          error => {
            console.error('Error placing order', error);
            console.log('orden11:'+ order);
          }
        );
      },
      error => {
        console.error('Error al obtener el nombre del usuario', error);
      }
    );
    
  }
}
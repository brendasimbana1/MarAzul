import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  menu: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    //this.http.get('/api/menu').subscribe((data: any) => {
      //this.menu = data;
    //});
  }

  agregarAlPedido(plato: any): void {
    console.log('Plato agregado al pedido:', plato);
  }
}

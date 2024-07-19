import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private URL = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  getTasks(){
     return this.http.get<any>(this.URL+'/task');
  }

  getPrivateTasks(){
    return this.http.get<any>(this.URL+'/private-task');
 }

  getMenu(){
  return this.http.get<any>(this.URL+'/api/platos');
  }
  calificacion(data: any): Observable<any>{
    return this.http.post<any>(this.URL+'/api/calificaciones', data);
  }
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.URL+'/todos');
  }
  createPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.URL+'/api/pedidos', pedido);
  }
  getPedido(id: string): Observable<any> {
    return this.http.get<any>(`${this.URL+'/api/pedidos'}/${id}`);
  }
  placeOrder(order: any): Observable<any> {
    console.log('ordens:'+ order);
    return this.http.post(`${this.URL}/api/pedidos`, order);
  }
  getUserName(): Observable<{ name: string }> {
    return this.http.get<any>(`${this.URL}/api/name`);
  }
  updatePlato(id: string, description: string): Observable<any> {
    return this.http.put(`${this.URL}/update-plato/${id}`, { description });
  }
  deletePedido(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/api/pedidos/${id}`);
  }
}

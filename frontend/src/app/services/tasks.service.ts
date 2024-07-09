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
    return this.http.get<any[]>(this.URL+'/api/pedidos');
  }
  createPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.URL+'/api/pedidos', pedido);
  }
  getPedido(id: string): Observable<any> {
    return this.http.get<any>(`${this.URL+'/api/pedidos'}/${id}`);
  }
}

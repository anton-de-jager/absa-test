import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  env = environment;

  getItems(model: string) {
    return this.http.get<any[]>(this.env.api + model);
  }

  getItem(model: string, id: number) {
    return this.http.get<any>(this.env.api + model + '/' + id);
  }

  createItem(model: string, item: any) {
    return this.http.post(this.env.api + model, item);
  }

  updatItem(model: string, item: any) {
    return this.http.put(this.env.api + model + '/' + item.id, item);
  }

  deleteItem(model: string, id: string) {
    return this.http.delete(this.env.api + model + '/' + id);
  }
}

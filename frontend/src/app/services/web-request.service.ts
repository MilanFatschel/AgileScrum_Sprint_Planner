import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'https://sprint-planner-backend.herokuapp.com';
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  getByState(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(username: string, password: string) {
    return this.http.post(
      `${this.ROOT_URL}/users/login`,
      {
        username,
        password,
      },
      { observe: 'response' }
    );
  }

  signup(username: string, password: string) {
    return this.http.post(
      `${this.ROOT_URL}/users`,
      {
        username,
        password,
      },
      { observe: 'response' }
    );
  }
}

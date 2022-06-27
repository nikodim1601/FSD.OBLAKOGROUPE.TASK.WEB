import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../interfaces/project';
import {environment} from '../../environments/environment';
import {Todo} from '../interfaces/Todo';

/**
 * Представляет сервис для работы с задачами.
 */
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  /**
   * Инициализирует экземпляр класса.
   * @param http HttpClient.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * API url.
   */
  private apiUrl = environment.apiUrl;

  getProjects(): Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  createTodo(task: Todo): Observable<Todo>{
    return this.http.post<Todo>(`${this.apiUrl}/todos`, task);
  }

}

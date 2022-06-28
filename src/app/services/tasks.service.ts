import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {plainToClass} from 'class-transformer';
import {Project} from '../Models/project-model';
import {Todo} from '../Models/todo-model';

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
    // return this.http.get<Project[]>(`${this.apiUrl}/projects`);
    return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
        map(result => {
            let proj = plainToClass(Project, result);
            // console.log(proj)
            return proj;
        })
    )
  }

  createTodo(task: Todo): Observable<Todo>{
    return this.http.post<Todo>(`${this.apiUrl}/todos`, task);
  }

}

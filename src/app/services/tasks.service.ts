import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
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

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
            map(result => {
                let proj = plainToClass(Project, result);
                // console.log(proj)
                return proj;
            })
        );
    }

    createTodo(task: Todo): Observable<Todo> {
        let result = this.http.post<Todo>(`${this.apiUrl}/todos/`, task);
        return result;
    }

    updateTodo(task: Todo): Observable<Todo> {
        let result = this.http.patch<Todo>(`${this.apiUrl}/projects/${task.project_id}/todos/${task.id}`, task);
        return result;
    }


}

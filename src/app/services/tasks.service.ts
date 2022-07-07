import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, retry, tap, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {plainToClass} from 'class-transformer';
import {Project} from '../models/project-model';
import {Todo} from '../models/todo-model';

/**
 * Представляет сервис для работы с задачами.
 */
@Injectable({
    providedIn: 'root'
})
export class TasksService {
    /**
     * API url.
     */
    private apiUrl = environment.apiUrl;

    /**
     * @param http HttpClient.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Получает список проектов.
     */
    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
            retry(1),
            catchError(TasksService.handleError),
            tap(result => {
                return plainToClass(Project, result);
            }),
        );
    }

    /**
     * Создает новую задачу.
     */
    createTodo(task: Todo): Observable<Todo> {
        let result = this.http.post<Todo>(`${this.apiUrl}/todos/`, task);
        return this.handleResult(result);
    }

    /**
     * Обновляет статус задачи.
     */
    updateTodo(task: Todo): Observable<Todo> {
        let result = this.http.patch<Todo>(`${this.apiUrl}/projects/${task.project_id}/todos/${task.id}`, task);
        return this.handleResult(result);
    }

    private handleResult(result: Observable<Todo>): Observable<Todo> {
        return result.pipe(
            retry(1),
            catchError(TasksService.handleError),
            tap(value => {
                return plainToClass(Todo, value);
            })
        );
    }

    private static handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status == 404) {
            return throwError('Error 404, resource not found.');
        }
        if (error.status == 400) {
            return throwError('Error 400, bad request.');
        }
        return throwError(error);
    }
}

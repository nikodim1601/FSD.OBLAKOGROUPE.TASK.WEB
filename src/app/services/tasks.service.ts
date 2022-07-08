import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, retry, tap, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {plainToClass} from 'class-transformer';
import {Project} from '../models/project-model';

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
    createTodo(task: Project): Observable<Project> {
        let result = this.http.post<Project>(`${this.apiUrl}/todos/`, task);
        return this.handleResult(result);
    }

    /**
     * Обновляет статус задачи.
     */
    updateTodo(projectId: number, taskId: number, isCompleted: boolean): Observable<Project> {
        let result = this.http.patch<Project>(`${this.apiUrl}/projects/${projectId}/todos/${taskId}`, {isCompleted: isCompleted});
        return this.handleResult(result);
    }

    private handleResult(result: Observable<Project>): Observable<Project> {
        return result.pipe(
            retry(1),
            catchError(TasksService.handleError),
            tap(value => {
                return plainToClass(Project, value);
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

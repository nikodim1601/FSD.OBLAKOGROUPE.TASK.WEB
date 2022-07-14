import {Component} from '@angular/core';
import {CreateTaskDialogComponent} from './create-task-dialog/create-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from './services/tasks.service';
import {Project} from './models/project-model';
import {Category} from './models/categories-model';
import {Constants} from './resources/Constants';
import {Subscription} from 'rxjs';
import {plainToClass} from 'class-transformer';
import {HttpErrorResponse} from '@angular/common/http';

/**
 * Пердставляет компоннет со списком проектов.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Возвращает список проектов
     */
    public projects: Project[];

    /**
     * Возвращает список категорий
     */
    private categories: Category[];

    /**
     * @param dialog MatDialog.
     * @param tasksService сервис для работы с задачами.
     */
    constructor(private dialog: MatDialog, private tasksService: TasksService) {
        this.categories = [];
        this.projects = [];
    }

    /**
     * Открывает диалог создания задачи.
     */
    async openDialogAsync() {
        const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
            data: {
                categories: this.categories
            }
        });
        let sub: Subscription = dialogRef.afterClosed().subscribe(async (project: Project) => {
                if (project) {
                    let index = this.projects.findIndex(proj => proj.id == project.id);
                    if (index !== -1) {
                        this.projects.splice(index, 1, project);
                    } else {
                        this.projects.push(project);
                        this.categories.push(plainToClass(Category, {id: project.id, name: project.title}));
                    }
                }
            },
            (error: HttpErrorResponse) => console.log(error),
            () => sub.unsubscribe()
        );

    }

    /**
     * Получает список проектов.
     */
    async onGetProjects() {
        let sub: Subscription = this.tasksService.getProjects().subscribe(
            (response: Project[]) => {
                this.projects = response;
                this.createCategories();
            },
            (error: HttpErrorResponse) => console.log(error),
            () => sub.unsubscribe()
        );
    }

    /**
     * Срабатывает при инициализации компонента.
     */
    async ngOnInit() {
        await this.onGetProjects();
    }

    /**
     * Обновляет список задач.
     */
    public async onUpdateTodo(projectId: number, taskId: number, isCompleted: boolean) {
        isCompleted = !isCompleted;
        let sub: Subscription = this.tasksService.updateTodo(projectId, taskId, isCompleted).subscribe(
            () => {
            },
            (error: HttpErrorResponse) => console.log(error),
            () => sub.unsubscribe()
        );
    }

    trackByTodoId(index: number, todos: { id: number, text: string; isCompleted: boolean; }) {
        return todos.id;
    }

    trackByProjectId(index: number, project: Project) {
        return project.id;
    }

    private createCategories() {
        this.categories = [];
        this.categories.push(plainToClass(Category, {id: null, name: Constants.NEW_PROJECT}));
        this.projects.forEach(value => {
            this.categories.push(plainToClass(Category, {id: value.id, name: value.title}));
        });
    }

}

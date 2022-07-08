import {Component} from '@angular/core';
import {CreateTaskDialogComponent} from './create-task-dialog/create-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from './services/tasks.service';
import {Project} from './models/project-model';
import {Category} from './models/categories-model';
import {Constants} from './resources/Constants';
import {Subscription} from 'rxjs';

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
        let sub: Subscription = dialogRef.afterClosed().subscribe(async isNeedRefresh => {
                if (isNeedRefresh) {
                    await this.onGetProjects();
                }
            },
            error => console.log(error),
            () => sub.unsubscribe()
        );

    }

    /**
     * Получает список проектов.
     */
    async onGetProjects() {
        let sub: Subscription = this.tasksService.getProjects().subscribe(
            (response) => {
                this.projects = response;
                this.CreateCategories();
            },
            (error) => console.log(error),
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
            () => {},
            (error) => console.log(error),
            () => sub.unsubscribe()
        );
    }

    private CreateCategories() {
        this.categories = [];
        this.categories.push(new Category(undefined, Constants.NEW_PROJECT));
        this.projects.forEach(value => {
            this.categories.push(new Category(value.id, value.title));
        });
    }

}

import {Component} from '@angular/core';
import {CreateTaskDialogComponent} from './create-task-dialog/create-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from './services/tasks.service';
import {Project} from './Models/project-model';
import {Todo} from './Models/todo-model';
import {Category} from './Models/categories-model';
import {Constants} from './resources/Constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private dialog: MatDialog, private tasksService: TasksService) {
        this.categories = []
    }

    openDialog() {
        const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
            data: {
                categories: this.categories
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });

    }

    private categories: Category[]

    private createCategories(){
        this.categories = []
        this.projects?.forEach(value => {
            this.categories.push(new Category(value.id, value.title))
        })
        this.categories.push(new Category(undefined, Constants.NEW_CATEGORY))
    }

    public projects: Project[] | undefined

    /**
     * Получает список проектов.
     */
    onGetProjects() {
        this.tasksService.getProjects().subscribe(
            (response) => {
                this.projects = response
                this.createCategories();
            },
            (error: any) => console.log(error),
            () => console.log("got tasks"),
        );
    }

    ngOnInit(){
        this.onGetProjects()
    }

    private todo: Todo = {
        isCompleted: false,
        project_id: 5,
        text: 'FromAngular'
    };

    onCreateTodo(){
        this.tasksService.createTodo(this.todo).subscribe(
            (response) => console.log(response),
            (error: any) => console.log(error),
            () => console.log("done"),
        );
    }
}

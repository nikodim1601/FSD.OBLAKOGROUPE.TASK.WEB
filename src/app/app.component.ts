import {Component} from '@angular/core';
import {CreateTaskDialogComponent} from './create-task-dialog/create-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from './services/tasks.service';
import {Todo} from './interfaces/Todo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private dialog: MatDialog, private tasksService: TasksService) {
    }

    openDialog() {
        const dialogRef = this.dialog.open(CreateTaskDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    /**
     * Получает список проектов.
     */
    onGetTasks() {
        this.tasksService.getProjects().subscribe(
            (response) => console.log(response),
            (error: any) => console.log(error),
            () => console.log("done"),
        );
    }

    ngOnInit(){
        this.onGetTasks()
    }
    private todo: Todo = {
        isCompleted: false,
        project_id: 10,
        text: 'name'
    };
    onCreateTask(){
        this.tasksService.createTodo(this.todo).subscribe(
            (response) => console.log(response),
            (error: any) => console.log(error),
            () => console.log("done"),
        );
    }


}

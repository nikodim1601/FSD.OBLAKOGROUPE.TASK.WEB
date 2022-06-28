import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Category} from '../Models/categories-model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Constants} from '../resources/Constants';
import {TasksService} from '../services/tasks.service';
import {Todo} from '../Models/todo-model';


@Component({
    selector: 'app-create-task-dialog',
    templateUrl: './create-task-dialog.component.html',
    styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
    newCategoryName = Constants.NEW_CATEGORY;
    todoFromControl = new FormControl('', [Validators.required, Validators.maxLength(300)]);
    categoryFromControl = new FormControl('', [Validators.required]);
    projectFormControl = new FormControl('', [Validators.required, Validators.maxLength(100)]);


    /**
     * Возвращает или устанавливает категории.
     */
    categories: Category[];

    constructor(
        @Inject(MAT_DIALOG_DATA) readonly data: { categories: Category[] },
        private tasksService: TasksService,
    ) {
        this.categories = [];
    }

    ngOnInit(): void {
        this.categories = this.data.categories;
    }

    GetErrorMessage(formControl: FormControl): string | void {
        if (formControl.hasError('required')) {
            return 'Поле обязательно для заполнения';
        }
        if (formControl.hasError('maxlength')) {
            return 'Название слишком длинное';
        }
    }

    onCreateTodo() {
        if (this.todoFromControl.value) {
            let todo = new Todo(null, this.todoFromControl.value, false, this.categories.find(value => value.name == this.categoryFromControl.value)?.id, this.projectFormControl.value);
            this.tasksService.createTodo(todo).subscribe(
                (response) => console.log(response),
                (error: any) => console.log(error),
                () => console.log("done"),
            );
        } else {
            throw new SyntaxError('Имя задачи не заполнено.');
        }
    }
}


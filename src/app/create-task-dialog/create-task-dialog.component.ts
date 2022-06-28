import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../Models/categories-model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Constants} from '../resources/Constants';
import {TasksService} from '../services/tasks.service';
import {Todo} from '../Models/todo-model';

/**
 * Представляет компонент создания задачи.
 */
@Component({
    selector: 'app-create-task-dialog',
    templateUrl: './create-task-dialog.component.html',
    styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
    /**
     * Возвращает категорию создания проекта.
     */
    readonly newCategoryName = Constants.NEW_CATEGORY;

    readonly createFromGroup = this.formBuild.group({
        todoFromControl: null,
        categoryFromControl: null,
        projectFormControl: null,
    });

    /**
     * Возвращает formControl имени задачи.
     */
    readonly todoFromControl = new FormControl('', [Validators.required, Validators.maxLength(300)]);
    categoryFromControl = new FormControl('', [Validators.required]);
    projectFormControl = new FormControl('', [Validators.required, Validators.maxLength(100)]);

    isValidForm: boolean = true;

    onControlChange() {
        if (this.todoFromControl.valid && this.categoryFromControl.valid) {
            if (this.categoryFromControl.value == Constants.NEW_CATEGORY) {
                this.isValidForm = !this.projectFormControl.valid;
            } else {
                this.isValidForm = false;
            }
        } else {
            this.isValidForm = true;
        }
    }

    /**
     * Возвращает или устанавливает категории.
     */
    categories: Category[];

    constructor(
        private formBuild: FormBuilder,
        @Inject(MAT_DIALOG_DATA) readonly data: { categories: Category[] },
        private tasksService: TasksService,
        private dialogRef: MatDialogRef<CreateTaskDialogComponent>
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
            let todo;
            if (this.categoryFromControl.value != Constants.NEW_CATEGORY) {
                this.categoryFromControl.setValue(null);
                todo = this.getTodoWithProjectName();
            } else {
                todo = this.getTodoWithProjectId();
            }
            this.tasksService.createTodo(todo).subscribe(
                (response) => console.log(response),
                (error: any) => console.log(error),
                () => this.closeDialog(true),
            );
        } else {
            throw new SyntaxError('Имя задачи не заполнено.');
        }
    }

    getTodoWithProjectId(): Todo {
        return new Todo(null,
            this.todoFromControl.value!,
            false,
            this.categories.find(value => value.name == this.categoryFromControl.value)?.id,
            null);
    }

    getTodoWithProjectName(): Todo {
        return new Todo(null,
            this.todoFromControl.value!,
            false,
            null,
            this.projectFormControl.value);
    }

    closeDialog(isNeedRefresh: boolean) {
        this.dialogRef.close(isNeedRefresh);
    }
}


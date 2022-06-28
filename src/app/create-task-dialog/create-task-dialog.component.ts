import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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

    /**
     * Возвращает группу formControl'ов.
     */
    readonly createFromGroup = this.formBuild.group({
        todoFromControl: ['', [Validators.required, Validators.maxLength(300)]],
        categoryFromControl: ['', [Validators.required]],
        projectFormControl: ['', [Validators.required, Validators.maxLength(100)]],
    });

    /**
     * Возвращает formControl'ы.
     */
    readonly controls = this.createFromGroup.controls;

    /**
     * Является ли форма валидной.
     */
    isValidForm: boolean = true;

    /**
     * Проверяет является ли форма валидной.
     */
    onControlChange() {
        if (this.controls.todoFromControl.valid && this.controls.categoryFromControl.valid) {
            if (this.controls.categoryFromControl.value == Constants.NEW_CATEGORY) {
                this.isValidForm = !this.controls.projectFormControl.valid;
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


    /**
     * @param formBuild fromBuilder.
     * @param data содержит переданный в компонент контекст.
     * @param tasksService сервис для работы с задачами.
     * @param dialogRef MatDialogRef.
     */
    constructor(
        private formBuild: FormBuilder,
        @Inject(MAT_DIALOG_DATA) readonly data: { categories: Category[] },
        private tasksService: TasksService,
        private dialogRef: MatDialogRef<CreateTaskDialogComponent>
    ) {
        this.categories = [];
    }

    /**
     * Срабатывает при инициализации компонента.
     */
    ngOnInit(): void {
        this.categories = this.data.categories;
    }

    /**
     * Возвращает ошибку.
     */
    GetErrorMessage(formControl: FormControl): string | void {
        if (formControl.hasError('required')) {
            return 'Поле обязательно для заполнения';
        }
        if (formControl.hasError('maxlength')) {
            return 'Название слишком длинное';
        }
    }

    /**
     * Создает задачу.
     */
    CreateTodo() {
        let categoryFromControl = this.controls.categoryFromControl;

        if (this.controls.todoFromControl.value) {
            let todo;
            if (categoryFromControl.value == Constants.NEW_CATEGORY) {
                categoryFromControl.setValue(null);
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

    private getTodoWithProjectId(): Todo {
        return new Todo(undefined,
            this.controls.todoFromControl.value!,
            false,
            this.categories.find(value => value.name == this.controls.categoryFromControl.value)?.id,
            undefined);
    }

    private getTodoWithProjectName(): Todo {
        return new Todo(undefined,
            this.controls.todoFromControl.value!,
            false,
            undefined,
            this.controls.projectFormControl.value);
    }

    /**
     * Закрывает диалог.
     */
    closeDialog(isNeedRefresh: boolean) {
        this.dialogRef.close(isNeedRefresh);
    }
}


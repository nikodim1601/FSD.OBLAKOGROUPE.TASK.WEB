import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Category} from '../models/categories-model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Constants} from '../resources/Constants';
import {TasksService} from '../services/tasks.service';
import {plainToClass} from 'class-transformer';
import {Project} from '../models/project-model';
import {HttpErrorResponse} from '@angular/common/http';

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
    readonly newProjectName = Constants.NEW_PROJECT;

    /**
     * Возвращает группу formControl'ов.
     */
    readonly createFormGroup = this.formBuild.group({
        todoFormControl: ['', [Validators.required, Validators.maxLength(300)]],
        categoryFormControl: ['', [Validators.required]],
        projectFormControl: ['', [Validators.required, Validators.maxLength(100)]],
    });

    /**
     * Возвращает formControl'ы.
     */
    readonly controls = this.createFormGroup.controls;

    /**
     * Является ли форма валидной.
     */
    isInvalidForm: boolean = true;

    /**
     * Возвращает или устанавливает категории.
     */
    categories: Category[];

    /**
     * Проверяет является ли форма валидной.
     */
    checkIsFormValid() {
        if (this.controls.todoFormControl.valid && this.controls.categoryFormControl.valid) {
            if (this.controls.categoryFormControl.value == Constants.NEW_PROJECT) {
                this.isInvalidForm = !this.controls.projectFormControl.valid;
            } else {
                this.isInvalidForm = false;
            }
        } else {
            this.isInvalidForm = true;
        }
    }

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
    async onCreateTodo() {
        let categoryFromControl = this.controls.categoryFormControl;

        if (this.controls.todoFormControl.value) {
            let project;
            if (categoryFromControl.value == Constants.NEW_PROJECT) {
                categoryFromControl.setValue(null);
                project = this.getTodoWithProjectName();
            } else {
                project = this.getTodoWithProjectId();
            }
            let sub = this.tasksService.createTodo(plainToClass(Project, project)).subscribe(
                (response: Project) => this.closeDialog(response),
                (error: HttpErrorResponse) => console.log(error),
                () => {
                    sub.unsubscribe();
                },
            );
        } else {
            throw new SyntaxError('Имя задачи не заполнено.');
        }
    }

    /**
     * Закрывает диалог.
     */
    closeDialog(project?: Project) {
        this.dialogRef.close(project);
    }

    trackByCategoryId(index: number, category: Category) {
        return category.id;
    }

    private getTodoWithProjectId() {
        return {
            text: this.controls.todoFormControl.value,
            isCompleted: false,
            project_id: this.categories.find(value => value.name == this.controls.categoryFormControl.value)?.id
        };
    }

    private getTodoWithProjectName() {
        return {
            title: this.controls.projectFormControl.value,
            isCompleted: false,
            text: this.controls.todoFormControl.value
        };
    }
}


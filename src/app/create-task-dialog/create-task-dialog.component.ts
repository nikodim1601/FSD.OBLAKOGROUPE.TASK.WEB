import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Category} from '../models/categories-model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Constants} from '../resources/Constants';
import {TasksService} from '../services/tasks.service';
import {plainToClass} from 'class-transformer';
import {Project} from '../models/project-model';

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
     * Возвращает или устанавливает категории.
     */
    categories: Category[];

    /**
     * Проверяет является ли форма валидной.
     */
    checkIsFormValid() {
        if (this.controls.todoFromControl.valid && this.controls.categoryFromControl.valid) {
            if (this.controls.categoryFromControl.value == Constants.NEW_PROJECT) {
                this.isValidForm = !this.controls.projectFormControl.valid;
            } else {
                this.isValidForm = false;
            }
        } else {
            this.isValidForm = true;
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
        let categoryFromControl = this.controls.categoryFromControl;

        if (this.controls.todoFromControl.value) {
            let project;
            if (categoryFromControl.value == Constants.NEW_PROJECT) {
                categoryFromControl.setValue(null);
                project = this.getTodoWithProjectName();
            } else {
                project = this.getTodoWithProjectId();
            }
            let sub = this.tasksService.createTodo(plainToClass(Project, project)).subscribe(
                (response) => this.closeDialog(response),
                (error: any) => console.log(error), //todo any убрать
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
            text: this.controls.todoFromControl.value,
            isCompleted: false,
            project_id: this.categories.find(value => value.name == this.controls.categoryFromControl.value)?.id
        };
    }

    private getTodoWithProjectName() {
        return {
            title: this.controls.projectFormControl.value,
            isCompleted: false,
            text: this.controls.todoFromControl.value
        };
    }
}


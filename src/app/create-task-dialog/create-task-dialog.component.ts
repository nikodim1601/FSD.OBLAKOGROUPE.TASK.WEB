import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Category} from '../Models/categories-model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Constants} from '../resources/Constants';


@Component({
    selector: 'app-create-task-dialog',
    templateUrl: './create-task-dialog.component.html',
    styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
    newCategoryName = Constants.NEW_CATEGORY;
    todoFromControl = new FormControl('', [Validators.required, Validators.maxLength(3)]);
    projectFormControl = new FormControl('', [Validators.required]);
    categoryFromControl = new FormControl('', [Validators.required, Validators.maxLength(100)]);

    /**
     * Возвращает или устанавливает категории.
     */
    @Input()
    categories: Category[] | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) readonly data: { categories: Category[] },
    ) {
    }

    ngOnInit(): void {
        // this.categoriesFromControl =
        this.categories = this.data.categories;
    }

    GetErrorMessage(formControl: FormControl): string | void {
        if(formControl.hasError('required')){
            return 'Поле обязательно для заполнения'
        }
        if(formControl.hasError('maxlength')){
            return 'Название слишком длинное'
        }
    }
}


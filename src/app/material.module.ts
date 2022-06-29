import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';



import {NgModule} from '@angular/core';

/**
 * Представляет модуль для подключения компонентов Material.
 */
@NgModule ({
    exports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,

    ]
})
export class MaterialAppModule {
}

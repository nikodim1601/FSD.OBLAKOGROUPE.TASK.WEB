import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAppModule} from './material.module';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialAppModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

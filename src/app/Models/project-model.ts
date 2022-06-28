import {Type} from 'class-transformer';
import {Todo} from './todo-model';
import "reflect-metadata";

export class Project{
    // constructor(id: number | undefined, title: string, todos: Todo[]) {
    //     this.title = title;
    //     this.todos = todos;
    // }
    id?: number;
    title?: string;
    @Type(() => Todo)
    todos?: Todo[];
}

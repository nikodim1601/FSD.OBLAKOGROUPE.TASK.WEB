import {Type} from 'class-transformer';
import {Todo} from './todo-model';
import "reflect-metadata";

export class Project{
    id?: number;
    title?: string;
    @Type(() => Todo)
    todos?: Todo[];
}

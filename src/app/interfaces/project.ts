import {Todo} from './Todo';

export interface Project {
    id?: number;
    title: string;
    todos: Todo[];
}

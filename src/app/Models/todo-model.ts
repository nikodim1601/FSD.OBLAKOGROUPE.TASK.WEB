import {FormControl} from '@angular/forms';


export class Todo {
    constructor(
        id: number | undefined | null,
        text: string,
        isCompleted: boolean,
        project_id: number | undefined | null,
        title: string | undefined | null,
    ) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;
        this.project_id = project_id;
        this.title = title;
    }

    id: number | undefined | null;
    text: string;
    isCompleted: boolean;
    project_id?: number | undefined | null;
    title?: string | undefined | null;
}

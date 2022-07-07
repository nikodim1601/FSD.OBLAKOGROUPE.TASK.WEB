export class Todo {
    constructor(
        id: number | undefined,
        text: string,
        isCompleted: boolean,
        project_id: number | undefined,
        title: string | undefined | null,
    ) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;
        this.project_id = project_id;
        this.title = title;
    }

    id: number | undefined;
    text: string;
    isCompleted: boolean;
    project_id?: number | undefined;
    title?: string | undefined | null;
}

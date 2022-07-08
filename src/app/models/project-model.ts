export class Project{
    id!: number;
    title!: string;
    todos!: [
        {
            id: number;
            text: string;
            isCompleted: boolean;
        }
    ]
}

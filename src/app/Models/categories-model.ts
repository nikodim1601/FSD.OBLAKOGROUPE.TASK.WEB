/**
 * Модель категорий.
 */
export class Category {

    constructor(id: number | undefined, name: string | undefined) {
        this.id = id;
        this.name = name;
    }

    readonly id?: number;
    readonly name?: string;
}


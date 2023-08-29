export function rate(i?: number): Array<number> {
    if (i! > 5) {
        return new Array(5);
    }
    return new Array(i);
}

export class PageResult<T>
{
    count!: number;
    pageNumber!: number;
    pageSize!: number;
    items!: T[];
}
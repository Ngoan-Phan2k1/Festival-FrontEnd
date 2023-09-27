export class Tour {
    public id: number;
    public name: string;
    public fromWhere: string;
    public toWhere: string;
    public description: string;
    public fromDate: string; 
    public toDate: string;
    public price: number;
    public total: number;

    constructor(
        id: number,
        name: string,
        fromWhere: string,
        toWhere: string,
        description: string,
        fromDate: string,
        toDate: string,
        price: number,
        total: number
    ) {
        this.id = id;
        this.name = name;
        this.fromWhere = fromWhere;
        this.toWhere = toWhere;
        this.description = description;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.price = price
        this.total = total;
    }
}
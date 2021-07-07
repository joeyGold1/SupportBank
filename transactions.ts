
export class Person {
    name:string;
    transactions: Transaction[] = [];
    balance = 0;
    constructor(name:string){
        this.name = name;
    }
    stringDetails(padding:number){
        return (this.name.padEnd(padding))+(((this.balance/100).toString()).padStart(7))
    }
}

export class Transaction {
    date : luxon.DateTime;
    from : Person;
    to : Person;
    narrative : String
    amount : number;

    constructor(date:luxon.DateTime,from:Person,to:Person,narrative:String,amount:number){
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.date = date;
        this.narrative = narrative;
    }
    stringDetails(padding:number){
        return this.date.toLocaleString().padEnd(padding)+this.to.name.padEnd(padding)+this.from.name.padEnd(padding)+this.narrative.padEnd(padding*2)+(this.amount/100).toString().padStart(6)
    }
    
}
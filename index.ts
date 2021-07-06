import * as luxon from 'luxon';
import { toNamespacedPath } from 'path/posix';
import { isUndefined } from 'util';
const csv = require('csv-parse');
const fs = require('fs');

class Person {
    name:string;
    transactions: Transaction[] = [];
    balance = 0;
    constructor(name:string){
        this.name = name;
    }
}

class Transaction {
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
    
}




processCSV("Transactions2014.csv")


function processCSV(filename:string){
    var rows: string[][] = [];
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (row: string[]) => {
        rows.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        mainProcess(rows);
    });
}


function mainProcess(rows:string[][]) {
     var people:Map<string,Person> = createPeople(rows);
     var transactions:Transaction[] = createTransactions(people,rows);
 }


function createPeople(rows:string[][]){
    let people: Map<string,Person> = new Map<string,Person>();
    let names: string[] = [];
    for (let i = 1;i<rows.length;i++){
        if (!(names.includes(rows[i][1]))){
            names.push(rows[i][1])
            people.set(rows[i][1], new Person(rows[i][1]))
        }
        if (!(names.includes(rows[i][2]))){
            names.push(rows[i][2])
            people.set(rows[i][2], new Person(rows[i][2]))
        }
    }
    return people;
}

function createTransactions(people:Map<string,Person>,rows:string[][]){
    let transactions: Transaction[] = [];
    for (let i = 1; i<rows.length;i++){
        let date = luxon.DateTime.fromFormat(rows[i][0], "dd/MM/yyyy");
        let fromPerson = people.get(rows[i][1]);
        let toPerson = people.get(rows[i][2]);
        if (fromPerson== undefined || toPerson==undefined){
            console.log("Error: Person on traction " + i+ " does not exist")
        }
        else{
            let amount = Number(rows[i][4]);
            let currentTransaction = new Transaction(date,fromPerson,toPerson,rows[i][3],amount);
            transactions.push(currentTransaction);
            fromPerson.balance -= amount;
            fromPerson.transactions.push(currentTransaction);
            toPerson.balance += amount;
            toPerson.transactions.push(currentTransaction);
        }
    }
    return transactions;
}
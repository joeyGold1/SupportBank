import * as luxon from 'luxon';
import { toNamespacedPath } from 'path/posix';
const csv = require('csv-parse');
const fs = require('fs');

class Person {
    name:string;
    balance = 0;
    constructor(name:string){
        this.name = name;
    }
}

class Transaction {
    from : Person;
    to : Person;
    amount : number;
    date : luxon.DateTime;
    narrative : String
    constructor(date:luxon.DateTime,from:Person,to:Person,narrative:String,amount:number){
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.date = date;
        this.narrative = narrative;
    }
    
}



console.log("Hello world.");

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
        console.log(rows[1][1])
        mainProcess(rows);
    });
}


function mainProcess(rows:string[][]) {
     var people:Person[] = createPeople(rows);
 }


function createPeople(rows:string[][]){
    let people: Person[] = [];
    let names: string[] = [];
    for (let i = 1;i<rows.length;i++){
        if (!(names.includes(rows[i][1]))){
            names.push(rows[i][1])
            people.push(new Person(rows[i][1]))
        }
        if (!(names.includes(rows[i][2]))){
            names.push(rows[i][2])
            people.push(new Person(rows[i][2]))
        }
    }
    console.log(names)
    return people
}
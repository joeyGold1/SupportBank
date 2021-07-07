import * as luxon from 'luxon';
import { toNamespacedPath } from 'path/posix';
const readline = require('readline');
const csv = require('csv-parse');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Person {
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
    stringDetails(padding:number){
        return this.date.toLocaleString().padEnd(padding)+this.to.name.padEnd(padding)+this.from.name.padEnd(padding)+this.narrative.padEnd(padding*2)+(this.amount/100).toString().padStart(6)
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

//Main processing of program happens here.
function mainProcess(rows:string[][]) {
     let people:Map<string,Person> = createPeople(rows);
     let transactions:Transaction[] = createTransactions(people,rows);
     userInputLoop(people,transactions);
 }


 ////NEEDS FINISHING
function userInputLoop(people: Map<string,Person>,transactions: Transaction[]){
    rl.question('Enter command... ', (userInput:string) => {
        if (userInput == "List All"){
            let peopleArray = Array.from(people.values());
            console.log("Name                  Balance")
            for (let i=0;i<peopleArray.length;i++) {
                console.log(peopleArray[i].stringDetails(22));
            }
        }
        else if (userInput.startsWith("List ")){
            let name:string = userInput.slice(5);
            let person = people.get(name);
            if (person == undefined) {
                console.log("Name "+name+" is not in file. ");
            }
            else {
                console.log("Date              To                From              "+"Narrative".padEnd(36)+"Amount");
                for (let i = 0;i<person.transactions.length;i++){
                    console.log(person.transactions[i].stringDetails(18));
                }
            }
        }
        else{
            console.log("Invalid command, please enter 'List All' or 'List <name>'. ");
        }



        rl.close();
      });
}
    
function outputTransactionDetails(transaction:Transaction){}




//Creates a map (dictionary) of each person, indexed by their name.
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

//Creates a list of every transaction and stores a record of it with each relevant person's data.
function createTransactions(people:Map<string,Person>,rows:string[][]){
    let transactions: Transaction[] = [];
    let fromPerson;
    let toPerson;
    for (let i = 1; i<rows.length;i++){
        let date = luxon.DateTime.fromFormat(rows[i][0], "dd/MM/yyyy");
        fromPerson = people.get(rows[i][1]);
        toPerson = people.get(rows[i][2]);
        //Compiler thinks these may be undefined. I don't think that is possible but this makes it happy.
        if (fromPerson== undefined || toPerson==undefined){
            console.log("Error: Person on traction " + i+ " does not exist")
        }
        else{
            let amount = Number(rows[i][4])*100;
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
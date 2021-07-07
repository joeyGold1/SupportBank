import * as luxon from "luxon";
import { toNamespacedPath } from "path/posix";
const readline = require("readline");
const csv = require("csv-parse");
const fs = require("fs");

import { configure, getLogger } from "log4js";
import { Person, Transaction } from "./transactions";
import { userInputLoop } from "./UserInputHandling";
import { convertJSONfileToStringArray } from "./JSONformatting";

configure({
  appenders: {
    file: { type: "fileSync", filename: "logs/debug.log" },
  },
  categories: {
    default: { appenders: ["file"], level: "trace" },
  },
});

const logger = getLogger("index.ts");

//Entry point to main program.
const transactions2013 = require("./Transactions2013.json");
mainProcess(convertJSONfileToStringArray(transactions2013));
//processCSV("DodgyTransactions2015.csv")

//Reads input from csv file and converts it to a 2 dimensional array of strings.
function processCSV(filename: string) {
  var rows: string[][] = [];
  fs.createReadStream(filename)
    .pipe(csv())
    .on("data", (row: string[]) => {
      rows.push(row);
    })
    .on("end", () => {
      logger.trace("CSV file successfully processed");
      mainProcess(rows);
    });
}

//Main processing of program happens here.
function mainProcess(rows: string[][]) {
  let people: Map<string, Person> = createPeople(rows);
  let transactions: Transaction[] = createTransactions(people, rows);
  logger.trace("Getting user input. ");
  userInputLoop(people, transactions);
}

//Creates a map (dictionary) of each person, indexed by their name.
function createPeople(rows: string[][]) {
  logger.trace("Getting list of people from rows of file.");
  let people: Map<string, Person> = new Map<string, Person>();
  let names: string[] = [];
  for (let i = 1; i < rows.length; i++) {
    logger.info( "Row " +i.toString() +" having new names read from it. Names on row are " + rows[i][1] + " and " + rows[i][2] + ".");
    if (!names.includes(rows[i][1])) {
      logger.info("Newly found name is: " + rows[i][1]);
      names.push(rows[i][1]);
      people.set(rows[i][1], new Person(rows[i][1]));
    }
    if (!names.includes(rows[i][2])) {
      logger.info("Newly found name is: " + rows[i][2]);
      names.push(rows[i][2]);
      people.set(rows[i][2], new Person(rows[i][2]));
    }
  }
  logger.trace("Map of people created. ");
  return people;
}

//Creates a list of every transaction and stores a record of it with each relevant person's data.
function createTransactions(people: Map<string, Person>, rows: string[][]) {
  logger.trace("Getting information from transactions. ");
  let transactions: Transaction[] = [];
  for (let i = 1; i < rows.length; i++) {
    createTransaction(i, rows, people, transactions);
  }
  return transactions;
}

function createTransaction(
  i: number,
  rows: string[][],
  people: Map<string, Person>,
  transactions: Transaction[]
) {
  let fromPerson;
  let toPerson;
  logger.info("Row " + i.toString() + " is being read. Its contents is: " + rows[i].toString());
  let date = luxon.DateTime.fromFormat(rows[i][0], "dd/MM/yyyy");
  if (!date.isValid) {
    logger.error("Date " + rows[i][0] + " on row " + i.toString() + " is in invalid format. ");
    logger.warn("Incorrect date being used instead - 01/01/1970. ");
    date = luxon.DateTime.fromFormat("01/01/1970", "dd/MM/yyyy");
  }
  fromPerson = people.get(rows[i][1]);
  toPerson = people.get(rows[i][2]);
  //Compiler thinks these may be undefined. I don't think that is possible but this makes it happy.
  if (!fromPerson || !toPerson) {
    console.log("Error: Person on traction " + i + " does not exist");
  } else {
    let amount = Number(rows[i][4]) * 100;
    if (isNaN(amount)) {
      logger.error("Row " + i.toString() + " contains an invalid amount: " + rows[i][4] + ". This has caused a NaN error. ");
      logger.warn("Amount assumed to be 0. Update the file manually or update results manually. ");
      amount = 0;
    }
    let currentTransaction = new Transaction(
      date,
      fromPerson,
      toPerson,
      rows[i][3],
      amount
    );
    transactions.push(currentTransaction);
    fromPerson.balance -= amount;
    fromPerson.transactions.push(currentTransaction);
    toPerson.balance += amount;
    toPerson.transactions.push(currentTransaction);
  }
}

import { getLogger } from "log4js";
import { Person, Transaction } from "./transactions";
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const logger = getLogger("UserInputHandling.ts");

export function listAll(people: Map<String, Person>) {
  let peopleArray = Array.from(people.values());
  console.log("Name                  Balance");
  for (let i = 0; i < peopleArray.length; i++) {
    logger.trace("Outputting information about " + peopleArray[i].name);
    console.log(peopleArray[i].stringDetails(22));
  }
}

export function listPerson(person: Person) {
  console.log("Date              To                From              " + "Narrative".padEnd(36) + "Amount");
  for (let i = 0; i < person.transactions.length; i++) {
    console.log(person.transactions[i].stringDetails(18));
  }
}

export function userInputLoop(
  people: Map<string, Person>,
  transactions: Transaction[]
) {
  rl.question("Enter command... ", (userInput: string) => {
    logger.info("User has inputted '" + userInput + "'");
    if (userInput == "List All") {
      logger.trace("Entering 'List All' process. ");
      listAll(people);
    } else if (userInput.startsWith("List ")) {
      logger.trace("Entering 'List Person' process. ");
      let name: string = userInput.slice(5);
      let person = people.get(name);
      if (person == undefined) {
        logger.error("User has entered name of person not in file. ");
        console.log("Name " + name + " is not in file. ");
      } else {
        logger.trace("Person found and entering process to list their details. ");
        listPerson(person);
      }
    } else {
      logger.error("User has entered an invalid command: '" + userInput + "'");
      console.log("Invalid command, please enter 'List All' or 'List <name>'. ");
    }
    rl.close();
  });
}

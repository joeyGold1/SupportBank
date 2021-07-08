import { getLogger } from "log4js";

const fs = require("fs");
const csv = require('csv-parse');


const logger = getLogger("CSVProcessing.ts");

//Reads input from csv file and converts it to a promise of a 2 dimensional array of strings.
export function getRowsFromCSV(filename: string) {
    let rows: string[][] = [];
    return new Promise<string[][]>((resolve,reject) => {
          fs.createReadStream(filename)
          .pipe(csv())
          .on("data", (row: string[]) => {
              rows.push(row);
          })
          .on("end", () => {
              logger.trace("CSV file successfully processed");
              resolve(rows);
          })
          .on('error',reject);
          ;
      });
  }
import { getLogger } from "log4js";
import { DateTime } from "luxon";
const logger = getLogger("JSONformatting.ts");

type FromJSONTransaction = {
  Date: string;
  FromAccount: string;
  ToAccount: string;
  Narrative: string;
  Amount: number;
};

export function convertJSONfileToStringArray(jsonFile: FromJSONTransaction[]) {
  let rows: string[][] = [["blank row"]];
  for (let i = 0; i < jsonFile.length; i++) {
    rows.push([
      DateTime.fromISO(jsonFile[i].Date).toLocaleString(),
      jsonFile[i].FromAccount,
      jsonFile[i].ToAccount,
      jsonFile[i].Narrative,
      jsonFile[i].Amount.toString(),
    ]);
    logger.info("Processing " + (i+1).toString() + "th transaction: " + rows[i+1].toString())
  }
  return rows;
}

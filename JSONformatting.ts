import { DateTime } from "luxon";

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
  }
  return rows;
}

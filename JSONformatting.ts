



type FromJSONTransaction = {
    Date: string;
    FromAccount: string;
    ToAccount: string;
    Narrative: string;
    Amount: number
    
}


export function convertJSONfileToStringArray(jsonFile:FromJSONTransaction[]){
    let rows:string[][] = [["blank row"]];
    for (let i=0;i<jsonFile.length;i++){
        rows.push([jsonFile[i].Date,jsonFile[i].FromAccount,jsonFile[i].ToAccount,jsonFile[i].Narrative,jsonFile[i].Amount.toString()])
    }
    return rows;
}
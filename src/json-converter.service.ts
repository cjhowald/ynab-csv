import {parse} from 'papaparse';
import ParseResult = PapaParse.ParseResult;
import {YNAB_COLS} from "./app.constant";

export class JsonConverter {

  csvToJson = (csv: string): ParseResult => {
    return parse(csv, {
      header: true,
      dynamicTyping: true
    });
  };

  convertedJson = (json: ParseResult, limit, lookup) => {
    let value = [];
    if (!(json && json.data)) {
      return null;
    }
    for (let i = 0; i < json.data.length && (!limit || i < limit); i++) {
      let row = json.data[i];
      let rowConverted = {};
      YNAB_COLS.forEach((col) => {
        let cell;
        cell = row[lookup[col]];
        if (col === 'Outflow' && cell < 0) {
          return rowConverted[col] = Math.abs(cell);
        }
        return rowConverted[col] = cell;
      });
      value.push(rowConverted);
    }
    return value;
  };

  convertedCsv = (json: ParseResult, limit, lookup) => {
    let string;
    if (json === null) {
      return null;
    }
    string = YNAB_COLS.join(',') + "\n";
    this.convertedJson(json, limit, lookup).forEach(function (row) {
      let row_values;
      row_values = [];
      YNAB_COLS.forEach(function (col) {
        return row_values.push(JsonConverter.stripCommas(row[col]));
      });
      return string += row_values.join(',') + "\n";
    });
    return string;
  };

  private static stripCommas = (str: String) => {
    if (!str || typeof str !== 'string') {
      return str;
    }
    return str.replace(/,/g, '')
  };
}

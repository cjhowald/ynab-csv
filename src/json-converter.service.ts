import {parse} from 'papaparse';
import ParseResult = PapaParse.ParseResult;
import {YNAB_COLS} from "./app.constant";

export class JsonConverter {

  private FIELD_MISMATCH = 'FieldMismatch';
  private TOO_FEW_FIELDS = 'TooFewFields';

  csvToJson = (csv: string): ParseResult => {
    let csvTruncated = csv;
    let result = JsonConverter.parseCsv(csv);
    // strip out extraneous rows before the header row
    while (result.errors && result.errors[0].row === 0 && result.errors[0].type === this.FIELD_MISMATCH) {
      csvTruncated = csvTruncated.split('\n').slice(1).join('\n');
      result = JsonConverter.parseCsv(csvTruncated);
    }
    // strip out remaining rows that failed to parse due to too few fields
    result.errors.forEach(({ code, row }) => {
      if (code === this.TOO_FEW_FIELDS) {
        result.data.splice(row,1);
      }
    });
    return result;
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

  private static stripCommas = (str: string) => {
    if (!str || typeof str !== 'string') {
      return str;
    }
    return str.replace(/,/g, '')
  };

  private static parseCsv = (csv: string) => {
    return parse(csv, {
      header: true,
      dynamicTyping: true
    })
  }
}

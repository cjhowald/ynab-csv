import { parse } from 'papaparse';
import ParseResult = PapaParse.ParseResult;
import {YNAB_COLS} from "./app.constant";

export class JsonConverter {

    csvToJson = (csv: string): ParseResult  => {
        return parse(csv, {
            "header": true
        });
    };

    convertedJson = (json: ParseResult, limit, lookup) => {
        let value;
        if (json === null) {
            return null;
        }
        value = [];
        if (json.data) {
            json.data.forEach(function (row, index) {
                let tmp_row;
                if (!limit || index < limit) {
                    tmp_row = {};
                    YNAB_COLS.forEach(function (col) {
                        let cell, number;
                        cell = row[lookup[col]];
                        switch (col) {
                            case 'Outflow':
                                number = JsonConverter.numberfy(cell);
                                if (lookup['Outflow'] === lookup['Inflow']) {
                                    if (number < 0) {
                                        return tmp_row[col] = Math.abs(number);
                                    }
                                } else {
                                    return tmp_row[col] = number;
                                }
                                break;
                            case 'Inflow':
                                number = JsonConverter.numberfy(cell);
                                if (lookup['Outflow'] === lookup['Inflow']) {
                                    if (number > 0) {
                                        return tmp_row[col] = number;
                                    }
                                } else {
                                    return tmp_row[col] = number;
                                }
                                break;
                            default:
                                return tmp_row[col] = cell;
                        }
                    });
                    return value.push(tmp_row);
                }
            });
        }
        return value;
    };

    convertedCsv = (json, limit, lookup) => {
        let string;
        if (json === null) {
            return null;
        }
        string = YNAB_COLS.join(',') + "\n";
        this.convertedJson(json, limit, lookup).forEach(function (row) {
            let row_values;
            row_values = [];
            YNAB_COLS.forEach(function (col) {
                return row_values.push(row[col]);
            });
            return string += row_values.join(',') + "\n";
        });
        return string;
    };

    private static numberfy = (val) => {
        if (val == null) {
            val = '';
        }
        if (isNaN(val)) {
            val = val.replace(/,/g, "");
            return Math.abs(+(val.match(/\d+.?\d*/)[0]));
        } else {
            return Math.abs(val);
        }
    };
}


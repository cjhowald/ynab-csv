export class JsonConverter {

    private ynabCols = ['Date', 'Payee', 'Category', 'Memo', 'Outflow', 'Inflow'];

    baseJson: any;

    parseCsv(csv) {
        return this.baseJson = Papa.parse(csv, {
            "header": true
        });
    }
    
    fields() {
        return this.baseJson.meta.fields;
    };
    
    rows() {
        return this.baseJson.data;
    };

    convertedJson(limit, lookup) {
        let value;
        if (this.baseJson === null) {
            return null;
        }
        value = [];
        if (this.baseJson.data) {
            this.baseJson.data.forEach(function (row, index) {
                let tmp_row;
                if (!limit || index < limit) {
                    tmp_row = {};
                    this.ynabCols.forEach(function (col) {
                        let cell, number;
                        cell = row[lookup[col]];
                        switch (col) {
                            case 'Outflow':
                                number = this.numberfy(cell);
                                if (lookup['Outflow'] === lookup['Inflow']) {
                                    if (number < 0) {
                                        return tmp_row[col] = Math.abs(number);
                                    }
                                } else {
                                    return tmp_row[col] = number;
                                }
                                break;
                            case 'Inflow':
                                number = this.numberfy(cell);
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
    }

    convertedCsv(limit, lookup) {
        let string;
        if (this.baseJson === null) {
            return null;
        }
        string = this.ynabCols.join(',') + "\n";
        this.convertedJson(limit, lookup).forEach(function (row) {
            let row_values;
            row_values = [];
            this.ynabCols.forEach(function (col) {
                return row_values.push(row[col]);
            });
            return string += row_values.join(',') + "\n";
        });
        return string;
    }

    private static numberfy(val) {
        let sign;
        if (val == null) {
            val = '';
        }
        if (isNaN(val)) {
            sign = val.match("-") || val.match(/\(.*\)/) ? -1 : 1;
            val = val.replace(/,/g, "");
            return +(val.match(/\d+.?\d*/)[0]) * sign;
        } else {
            return val;
        }
    }
}


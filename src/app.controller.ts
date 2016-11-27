import ParseResult = PapaParse.ParseResult;
import {JsonConverter} from "./json-converter.service";
export class AppController {

    angular_loaded = true;
    data = { source: null };
    json: ParseResult;
    jsonConverted;
    ynab_map = {
        Date: 'Value date',
        Payee: 'Payment Details',
        Category: 'Category',
        Memo: 'Beneficiary / Originator',
        Outflow: 'Debit',
        Inflow: 'Credit'
    };
    limit = 20;

    constructor(private $scope, private JsonConverter: JsonConverter, private YNAB_COLS) {
        'ngInject';

        this.$scope.$watch(() => this.data.source, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue && newValue.length) {
                this.json = JsonConverter.csvToJson(newValue);
                this.convertJson();
            }
        });
    }

    downloadFile() {
        var a;
        a = document.createElement('a');
        a.href = 'data:attachment/csv;base64,' + btoa(unescape(encodeURIComponent(this.csvString())));
        a.target = '_blank';
        a.download = 'ynab_data.csv';
        document.body.appendChild(a);
        return a.click();
    }

    csvString() {
        return this.JsonConverter.convertedCsv(this.json, null, this.ynab_map);
    }

    convertJson() {
        this.jsonConverted = this.JsonConverter.convertedJson(this.json, this.limit, this.ynab_map);
    }
}
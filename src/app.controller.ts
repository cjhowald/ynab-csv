export class AppController {

    constructor(private $scope, private JsonConverter, private YNAB_COLS) {
        'ngInject';

        console.log("controller loaded");
        this.$scope.$watch('data.source', function (newValue, oldValue) {
            if (newValue && newValue.length > 0) {
                return JsonConverter.parseCsv(newValue);
            }
        });

        $scope["export"] = function (limit) {
            return JsonConverter.convertedJson(limit, $scope.ynab_map);
        };
    }

    test = "foobar";
    angular_loaded = true;
    ynab_cols = this.YNAB_COLS;
    data = {};
    ynab_map = {
        Date: 'Date',
        Payee: 'Payee',
        Category: 'Category',
        Memo: 'Memo',
        Outflow: 'Amount',
        Inflow: 'Amount'
    };

    downloadFile() {
        var a;
        a = document.createElement('a');
        a.href = 'data:attachment/csv;base64,' + btoa(encodeURIComponent(this.csvString()));
        a.target = '_blank';
        a.download = 'ynab_data.csv';
        document.body.appendChild(a);
        return a.click();
    }

    csvString() {
        return this.JsonConverter.convertedCsv(null, this.ynab_map);
    }
}
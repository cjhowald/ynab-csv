import {AppController} from "./app.controller";

// TODO breakdown into smaller components
const AppComponent: ng.IComponentOptions = {
    controller: AppController,
    template: `<section ng-cloak> 
    {{ $ctrl.YNAB_COLS }}
    {{ $ctrl.test }}
    <input type="text" value="{{ $ctrl.YNAB_COLS }}">
    <div id='header_nav' class='show_on_load'>
        <div class='container'>
            <!-- <h1>YNAB CSV</h1> -->
            <div class='pull-right' ng-if='$ctrl.json'>
                <!-- <div class='btn btn-default' ng-click='reloadApp()'><i class='fa fa-refresh'></i></div> -->
                <div class='btn btn-primary' ng-click='$ctrl.downloadFile()'><i class='fa fa-cloud-download'></i> Save YNAB
                    Data
                </div>
            </div>
            <a href='https://github.com/cjhowald/ynab-csv' target='_blank' class='btn btn-default'><i
                    class='fa fa-github'></i> Fork me on Github</a>
        </div>
    </div>

    <div dropzone="$ctrl.data.source">
        <div class='container show_on_load'>
            <br>
            <div id='upload_wrapper' ng-if='!$ctrl.json'>
                <div id='drop_text'>Drop File</div>
                <br>
                <!-- <div class='btn btn-primary'>Or Choose</div> -->
                <div class='fileUpload btn btn-primary'>
                    <span>Or Choose <i class='fa fa-folder-open'></i></span>
                    <input id='file' type='file' fileread='$ctrl.data.source'/>
                </div>
            </div>

            <div id='tool_wrapper' ng-if='$ctrl.json'>

                <div class="panel panel-default">
                    <div class="panel-heading"><strong>YNAB Data</strong> <em>(1st {{$ctrl.limit}} rows)</em></div>
                    <div class='table-container'>
                        <table class='table'>
                            <thead>
                            <tr>
                                <th ng-repeat='col in $ctrl.YNAB_COLS'>
                                    {{col}}<br/>
                                    <select ng-model="$ctrl.ynab_map[col]"
                                            ng-options="f for f in $ctrl.json.meta.fields"
                                            ng-change="$ctrl.convertJson()"></select>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr ng-repeat='row in $ctrl.jsonConverted'>
                                <td ng-repeat='col in $ctrl.YNAB_COLS'>
                                    <span>{{row[col]}}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-heading"><strong>Source Data</strong> <em>(1st 10 rows)</em></div>
                    <div class='table-container'>
                        <table class='table'>
                            <thead>
                            <tr>
                                <th ng-repeat='col in $ctrl.json.meta.fields track by $index'>{{col}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr ng-repeat='row in $ctrl.json.data | limitTo:10'>
                                <td ng-repeat='col in $ctrl.json.meta.fields track by $index'>{{row[col]}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>
`
};

export default AppComponent;
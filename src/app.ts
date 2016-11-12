import * as angular from 'angular';
import {YNAB_COLS} from "./app.constant";
import {FilereadDirective} from "./fileread.directive";
import {DropzoneDirective} from "./dropzone.directive";
import {AppController} from "./app.controller";
import {JsonConverter} from "./json-converter.service";

angular.module('app', [])
    .constant('YNAB_COLS', YNAB_COLS)
    .directive('fileread', FilereadDirective)
    .directive("dropzone", DropzoneDirective)
    .service('JsonConverter', JsonConverter)
    .controller('AppController', function($scope) {
        console.log('hisd');
        $scope.angular_loaded = true;
    });

angular.bootstrap(document, ['app'], {
    strictDi: true
});


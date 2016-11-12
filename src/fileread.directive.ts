export function FilereadDirective() {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            return element.bind("change", function (changeEvent) {
                var reader;
                reader = new FileReader();
                reader.onload = function (loadEvent) {
                    return scope.$apply(function () {
                        return scope.fileread = loadEvent.target.result;
                    });
                };
                return reader.readAsText(changeEvent.target.files[0]);
            });
        }
    };
}
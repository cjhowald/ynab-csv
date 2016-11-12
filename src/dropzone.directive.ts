export function DropzoneDirective() {
    return {
        transclude: true,
        replace: true,
        template: '<div class="dropzone"><div ng-transclude></div></div>',
        scope: {
            dropzone: "="
        },
        link: function (scope, element, attributes) {
            element.bind('dragenter', function (event) {
                element.addClass('dragging');
                return event.preventDefault();
            });
            element.bind('dragover', function (event) {
                var efct;
                element.addClass('dragging');
                event.preventDefault();
                efct = event.dataTransfer.effectAllowed;
                return event.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
            });
            element.bind('dragleave', function (event) {
                element.removeClass('dragging');
                return event.preventDefault();
            });
            return element.bind('drop', function (event) {
                var reader;
                element.removeClass('dragging');
                event.preventDefault();
                event.stopPropagation();
                reader = new FileReader();
                reader.onload = function (loadEvent) {
                    return scope.$apply(function () {
                        return scope.dropzone = loadEvent.target.result;
                    });
                };
                return reader.readAsText(event.dataTransfer.files[0]);
            });
        }
    };
}
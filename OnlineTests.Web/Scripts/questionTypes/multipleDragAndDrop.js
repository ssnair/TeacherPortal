angular.module('multipleDragAndDropApp', ['ui.bootstrap', 'dragularModule', 'classy'])
    .classy.controller({
        name: 'multipleDragAndDropController',
        inject: ['$scope', 'dragularService'],
        data: {
            dropTargets: [],
            answerOptions: []
        },
        init: function () {
            this.$.addDropTarget();

        },
        methods: {
            addDropTarget: function (id, text, setContainerCapacity, containerCapacity) {
                id = typeof id !== 'undefined' ? id : this._getNextDropTargetId();
                setContainerCapacity = typeof setContainerCapacity !== 'undefined' ? setContainerCapacity : false;
                containerCapacity = typeof containerCapacity !== 'undefined' ? containerCapacity : 1;
                text = text || 'DROP TARGET ' + id;

                var newDropTarget = {
                    id: id,
                    text: text,
                    placeholder: "Click to add contents.",
                    setContainerCapacity: setContainerCapacity,
                    containerCapacity: containerCapacity,
                    answerOptions: []
                };

                for (var i = 0; i < this.answerOptions.length; i++) {
                    var answerOption = this.answerOptions[i];
                    newDropTarget.answerOptions.push({
                        id: answerOption.id,
                        answerOption: answerOption,
                        worth: 0,
                        isCorrect: false
                    });
                };
                this.$.dropTargets.push(newDropTarget);
            },

            _getNextDropTargetId: function getNextDropTargetId() {
                return this._getNextId(this.dropTargets, '1');
            },

            _getNextAnswerOptionId: function () {
                return this._getNextId(this.answerOptions, 'A');
            },

            _getNextId: function (container, firstId) {
                if (container.length == 0) {
                    return firstId;
                }

                var maxId = firstId;
                for (var i = 0; i < container.length; i++) {
                    if (container[i].id > maxId) {
                        maxId = container[i].id;
                    }
                }
                return String.fromCharCode(maxId.charCodeAt(0) + 1);
            }

        }
    })

    /*
(function (angular) {
    function multipleDragAndDropController($scope, dragularService) {
        angular.extend(this, {
            dropTargets: [],
            answerOptions: [],

        }

        (function init() {

            // alert('foo');
        })()
                    );
    }

    angular.module('multipleDragAndDropApp', ['ui.bootstrap', 'dragularModule'])
        .controller('multipleDragAndDropController', ['$scope', 'dragularService', multipleDragAndDropController])
})(window.angular);
*/
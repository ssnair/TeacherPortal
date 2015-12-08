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
            this.$.addAnswerOption();

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

            removeDropTarget: function (item) {
                for (var i = 0; i < this.dropTargets.length; i++) {
                    if (this.dropTargets[i].id === item.id) {
                        this.dropTargets.splice(i, 1);
                        break;
                    }
                }
            },

            addAnswerOption: function(id, text, timesCanBeUsed) {
                id = typeof id !== 'undefined' ? id : this._getNextAnswerOptionId();
                timesCanBeUsed = typeof timesCanBeUsed !== 'undefined' ? timesCanBeUsed : 1;
                text = text || 'ANSWER OPTION ' + id;

                var newAnswerOption = {
                    id: id,
                    text: text,
                    placeholder: "Click to add contents.",
                    timesCanBeUsed: 1
                };

                for (var i = 0; i < this.dropTargets.length; i++) {
                    this.dropTargets[i].answerOptions.push({
                        id: newAnswerOption.id,
                        answerOption: newAnswerOption,
                        worth: 0,
                        isCorrect: false
                    });
                };
                this.answerOptions.push(newAnswerOption);
            },

            removeAnswerOption: function (item) {
                for (var i = 0; i < this.$.answerOptions.length; i++) {
                    if (this.$.answerOptions[i].id === item.id) {
                        this.$.answerOptions.splice(i, 1);
                        // Remove answer option from matches
                        for (var dt = 0; dt < this.$.dropTargets.length; dt++) {
                            for (var dto = 0; j < this.$.dropTargets[dt].answerOptions; dto++) {
                                if (this.$.dropTargets[dt].answerOptions[dto].id == item.id) {
                                    this.$.dropTargets[dt].answerOptions.splice(dto, 1);
                                }
                            };
                        };
                        break;
                    }
                }
            },

            save: function() {
                debugger;
                if (false && !validateEmptyQuestionText(hfQBody.value))
                    return;

                // TODO: IL - remove hardcoded answers vertically
                var answers = [];
                for (i = 0; i < this.$.answerOptions.length; i++) {
                    answers.push({
                        Id: this.$.answerOptions[i].id,
                        Text: this.$.answerOptions[i].text,
                        DisplayAnswersVertically: $('#cboxAnswersVertically:checked').val() ? 1 : 0,
                        TimesCanBeUsed: this.$.answerOptions[i].timesCanBeUsed
                    });
                }

                var targets = [];
                for (i = 0; i < this.$.dropTargets.length; i++) {
                    var dropTarget = {
                        Id: this.$.dropTargets[i].id,
                        Text: this.$.dropTargets[i].text,
                        SetContainerCapacity: this.$.dropTargets[i].setContainerCapacity,
                        ContainerCapacity: this.$.dropTargets[i].containerCapacity,
                        AnswerOptions: []
                    };
                    var answerIndex = -1;
                    for (var j = 0; j < this.$.dropTargets[i].answerOptions.length; j++) {
                        dropTarget.AnswerOptions.push({
                            Id: this.$.dropTargets[i].answerOptions[j].id,
                            IsCorrect: this.$.dropTargets[i].answerOptions[j].isCorrect,
                            Worth: this.$.dropTargets[i].answerOptions[j].worth
                        });
                    }
                    targets.push(dropTarget);
                }

                var request = {
                    id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
                    subjectId: null,
                    gradeLevel: null,
                    questionTypeId: 40,   // Multiple drag and drop
                    questionText: specialTrim(hfQBody.value || ''),
                    passageId: null,
                    complexity: null,
                    difficulty: null,
                    userId: null,
                    minScore: null,
                    maxScore: null,
                    targ: null,
                    courseId: null,
                    notes: $("#multipleDragAndDrop_Notes").val(),
                    statusId: 1,
                    approveUser: null,
                    answers: answers,
                    targets: targets
                };

                $.post(
                    "/home/MultipleDragAndDrop_Save",
                    $.toDictionary(request),
                    function (data, textStatus, jqXHR) {
                        window.parent.postMessage(data.data + ',40', '*');
                        //BootstrapDialog.show({
                        //    type: BootstrapDialog.TYPE_SUCCESS,
                        //    title: 'Information',
                        //    message: 'The Question was saved successfully! The Question ID is : ' + data.data,
                        //    buttons: [{
                        //        label: 'Ok',
                        //        action: function (dialogItself) {
                        //            dialogItself.close();
                        //        }
                        //    }]
                        //});
                    },
                    'json')
                .fail(function (data, textStatus, jqXHR) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DANGER,
                        title: 'Information',
                        message: 'An error has occured trying to save your Question<br>Please try again!',
                        buttons: [{
                            label: 'Ok',
                            action: function (dialogItself) {
                                dialogItself.close();
                            }
                        }]
                    });
                });
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


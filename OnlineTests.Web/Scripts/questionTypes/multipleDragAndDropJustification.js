$(function () {
    var settings = settings || {
        targets: [],
        answers: [],
        targetsJustification: [],
        answersJustification: []
    };
    
    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
    }

    var multipleDragAndDropJ = new MultipleDragAndDropJ('edit', settings);
    var multipleDragAndDropPreviewJ = null;

    $("#multipleDragAndDrop_AddAnswerJ").click(function () {
        if (true) {   
            if (!validateEmptyQuestionText(hfAnswerMethod.value))
                return;

            var answer = hfAnswerMethod.value;
            multipleDragAndDropJ.addAnswer(answer);
            //ckEditor71.setData('');
        }
    });

    $("#multipleDragAndDrop_AddAnswerJustification").click(function () {
        if (true) {
            if (!validateEmptyQuestionText(hfAnswerJustification.value))
                return;

            var answer = hfAnswerJustification.value;
            multipleDragAndDropJ.addAnswerJustification(answer);
            //ckEditor72.setData('');
        }
    });

    $("#multipleDragAndDrop_AddOptionJ").click(function () {
        if (true) {   // add Validation here
            if (!validateEmptyQuestionText(hfOptionMethod.value))
                return;

            var option = hfOptionMethod.value;
            multipleDragAndDropJ.addOption(option);
            //ckEditor73.setData('');
        }
    });

    $("#multipleDragAndDrop_AddOptionJustification").click(function () {
        if (true) {   // add Validation here
            if (!validateEmptyQuestionText(hfOptionJustification.value))
                return;

            var option = hfOptionJustification.value;
            multipleDragAndDropJ.addOptionJustification(option);
            //ckEditor74.setData('');
        }
    });

    $("#btnMultipleDragAndDrop_PreviewJ").click(function () {
        var settings = {
            answers: [],
            targets: [],
            answersJustification: [],
            targetsJustification: [],
            expectedAnswers: []
        }

        for (var i = 0; i < multipleDragAndDropJ.targets.length; i++) {
            settings.targets.push({
                text: multipleDragAndDropJ.targets[i].text,
                id: multipleDragAndDropJ.targets[i].id
            });
            settings.expectedAnswers.push({
                optionId: multipleDragAndDropJ.targets[i].id,
                answerId: multipleDragAndDropJ.targets[i].answerId
            });
        };

        for (var i = 0; i < multipleDragAndDropJ.targetsJustification.length; i++) {
            settings.targetsJustification.push({
                text: multipleDragAndDropJ.targetsJustification[i].text,
                id: multipleDragAndDropJ.targetsJustification[i].id
            });
            settings.expectedAnswers.push({
                optionId: multipleDragAndDropJ.targetsJustification[i].id,
                answerId: multipleDragAndDropJ.targetsJustification[i].answerId
            });
        };

        for (var i = 0; i < multipleDragAndDropJ.answers.length; i++) {
            settings.answers.push({
                text: multipleDragAndDropJ.answers[i].text,
                id: multipleDragAndDropJ.answers[i].id
            });
        };

        for (var i = 0; i < multipleDragAndDropJ.answersJustification.length; i++) {
            settings.answersJustification.push({
                text: multipleDragAndDropJ.answersJustification[i].text,
                id: multipleDragAndDropJ.answersJustification[i].id
            });
        };

        multipleDragAndDropPreviewJ = new MultipleDragAndDropJ('preview', settings);

        var editor = hfQBody.value;

        $('#multipleDragAndDrop_questionContainerJ').html(editor);
        reloadMathJax('multipleDragAndDrop_questionContainerJ');
        $("#multipleDragAndDrop_resultJ").html('');

    });

    $("#multipleDragAndDrop_submitAnswerJ").click(function () {
        var methodResult = true;
        // check method answers
        for (var i = 0; i < multipleDragAndDropPreviewJ.targets.length; i++) {
            var option = multipleDragAndDropPreviewJ.targets[i];
            for (var i = 0; i < multipleDragAndDropPreviewJ.settings.expectedAnswers.length; i++) {
                if (multipleDragAndDropPreviewJ.settings.expectedAnswers[i].optionId == option.id) {
                    methodResult = option.answerId === multipleDragAndDropPreviewJ.settings.expectedAnswers[i].answerId;
                    break;
                }
            }
            if (!methodResult) {
                break;
            }
        }

        var justificationResult = true;
        // check justification answers
        for (var i = 0; i < multipleDragAndDropPreviewJ.targetsJustification.length; i++) {
            var option = multipleDragAndDropPreviewJ.targetsJustification[i];
            for (var i = 0; i < multipleDragAndDropPreviewJ.settings.expectedAnswers.length; i++) {
                if (multipleDragAndDropPreviewJ.settings.expectedAnswers[i].optionId == option.id) {
                    justificationResult = option.answerId === multipleDragAndDropPreviewJ.settings.expectedAnswers[i].answerId;
                    break;
                }
            }
            if (!justificationResult) {
                break;
            }
        }

        if (methodResult && justificationResult)
            $('#multipleDragAndDrop_resultJ').html('<img src="/onlinedw/Content/images/win.png" width="50" height="50"/>')
        else
            $('#multipleDragAndDrop_resultJ').html('<img src="/onlinedw/Content/images/lose.png" width="50" height="50"/>')
    });

    $("#multipleDragAndDrop_closeModalJ").on('click', function () {
        $('#multipleDragAndDrop_PreviewJ').modal('hide');
        multipleDragAndDropJ.redraw();
    });

    $("#bntMultipleDragAndDrop_SaveJ").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;
        
        var answers = [];
        for (i = 0; i < multipleDragAndDropJ.answers.length; i++) {
            answers.push({ id: i + 1, text: multipleDragAndDropJ.answers[i].text});
        }
        if (answers.length == 0) {
            displayWarning('Option Method required!');
            return;
        }
            
        var targets = [];
        for (i = 0; i < multipleDragAndDropJ.targets.length; i++) {
            var answerIndex = -1;
            for (var j = 0; j < answers.length; j++) {
                if (multipleDragAndDropJ.answers[j].id === multipleDragAndDropJ.targets[i].answerId) {
                    answerIndex = j;
                    break;
                }
            }
            targets.push({ id: i + 1, text: multipleDragAndDropJ.targets[i].text, answerId: answerIndex == -1 ? 0 : answers[answerIndex].id, answerText: answerIndex == -1 ? '' : answers[answerIndex].text });
        }
        if (targets.length == 0) {
            displayWarning('Answer Method required!');
            return;
        }

        var answersj = [];
        for (i = 0; i < multipleDragAndDropJ.answersJustification.length; i++) {
            answersj.push({ id: i + 1, text: multipleDragAndDropJ.answersJustification[i].text });
        }
        if (answersj.length == 0) {
            displayWarning('Option Justification required!');
            return;
        }

        var targetsj = [];
        for (i = 0; i < multipleDragAndDropJ.targetsJustification.length; i++) {
            var answerIndex = -1;
            for (var j = 0; j < answersj.length; j++) {
                if (multipleDragAndDropJ.answersJustification[j].id === multipleDragAndDropJ.targetsJustification[i].answerId) {
                    answerIndex = j;
                    break;
                }
            }
            targetsj.push({ id: i + 1, text: multipleDragAndDropJ.targetsJustification[i].text, answerId: answerIndex == -1 ? 0 : answersj[answerIndex].id, answerText: answerIndex == -1 ? '' : answersj[answerIndex].text });
        }
        if (targetsj.length == 0) {
            displayWarning('Answer Justification required!');
            return;
        }
        
        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 44,   // Multiple drag and drop Justification
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#commentsQuestion7").val(),
            statusId: 1,
            approveUser: null,
            answers: answers,
            targets: targets,
            justification_answers: answersj,
            justification_targets: targetsj
        };

        $.post(
            "/OnlineDW/home/MultipleDragAndDropJustification_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',44', '*');
                //BootstrapDialog.show({
                //    type: BootstrapDialog.TYPE_SUCCESS,
                //    title: 'Information',
                //    message: 'The Question was saved successfully The Question ID is : ' + data.data,
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
    });

});

MultipleDragAndDropJ = function (mode, settings) {
    settings = settings || {
        targets: [],
        answers: [],
        targetsJustification: [],
        answersJustification: []
    };

    this.mode = mode;

    this.settings = JSON.parse(JSON.stringify(settings));

    this.targets = [];
    this.answers = [];
    this.targetsJustification = [];
    this.answersJustification = [];
    
    for (var i = 0; i < settings.targets.length; i++) {
        var option = new multipleDragAndDropOptionJ(this, settings.targets[i].text);
        option.id = settings.targets[i].id;
        option.answerId = settings.targets[i].answerId;
        option.answerText = settings.targets[i].answerText;
        this.targets.push(option);
    }

    for (var i = 0; i < settings.targetsJustification.length; i++) {
        var option = new multipleDragAndDropOptionJustification(this, settings.targetsJustification[i].text);
        option.id = settings.targetsJustification[i].id;
        option.answerId = settings.targetsJustification[i].answerId;
        option.answerText = settings.targetsJustification[i].answerText;
        this.targetsJustification.push(option);
    }

    for (var i = 0; i < settings.answers.length; i++) {
        var answer = new multipleDragAndDropAnswerJ(this, settings.answers[i].text);
        answer.id = settings.answers[i].id;
        this.answers.push(answer);
    }

    for (var i = 0; i < settings.answersJustification.length; i++) {
        var answer = new multipleDragAndDropAnswerJustification(this, settings.answersJustification[i].text);
        answer.id = settings.answersJustification[i].id;
        this.answersJustification.push(answer);
    }

    if (mode === 'edit') {
        this.answersContainer = $("#MultipleDragAndDropAnswersJ");
        this.optionsContainer = $("#MultipleDragAndDropOptionsJ");
        this.answersJustificationContainer = $("#MultipleDragAndDropAnswersJustification");
        this.optionsJustificationContainer = $("#MultipleDragAndDropOptionsJustification");
    } else if (mode === 'preview') {
        this.answersContainer = $("#MultipleDragAndDropPreviewAnswersJ");
        this.optionsContainer = $("#MultipleDragAndDropPreviewOptionsJ");
        this.answersJustificationContainer = $("#MultipleDragAndDropPreviewAnswersJustification");
        this.optionsJustificationContainer = $("#MultipleDragAndDropPreviewOptionsJustification");
    }

    
    this.addAnswer = function (answer) {
        var newAnswer = new multipleDragAndDropAnswerJ(this, answer);
        this.answers.push(newAnswer);
        this.redraw();
    };

    this.addAnswerJustification = function (answer) {
        var newAnswer = new multipleDragAndDropAnswerJustification(this, answer);
        this.answersJustification.push(newAnswer);
        this.redraw();
    };

    this.addOption = function (option) {
        var newOption = new multipleDragAndDropOptionJ(this, option);
        this.targets.push(newOption);
        this.redraw();
    };

    this.addOptionJustification = function (option) {
        var newOption = new multipleDragAndDropOptionJustification(this, option);
        this.targetsJustification.push(newOption);
        this.redraw();
    };

    this.deleteOption = function (id) {
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].id === id) {
                this.targets.splice(i, 1);
                this.redraw();
                break;
            };
        }
    };

    this.deleteOptionJustification = function (id) {
        for (var i = 0; i < this.targetsJustification.length; i++) {
            if (this.targetsJustification[i].id === id) {
                this.targetsJustification.splice(i, 1);
                this.redraw();
                break;
            };
        }
    };

    this.deleteAnswer = function (id) {
        for (var i = 0; i < this.answers.length; i++) {
            if (this.answers[i].id === id) {
                this.answers.splice(i, 1);
                this.redraw();
                break;
            };
        }
        // if the answer was used in an option, delete it
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].answerId === id) {
                this.targets[i].answerId = 0;
                this.targets[i].answerText = '';
                this.redraw();
                break;
            };
        }
    };

    this.deleteAnswerJustification = function (id) {
        for (var i = 0; i < this.answersJustification.length; i++) {
            if (this.answersJustification[i].id === id) {
                this.answersJustification.splice(i, 1);
                this.redraw();
                break;
            };
        }
        // if the answer was used in an option, delete it
        for (var i = 0; i < this.targetsJustification.length; i++) {
            if (this.targetsJustification[i].answerId === id) {
                this.targetsJustification[i].answerId = 0;
                this.targetsJustification[i].answerText = '';
                this.redraw();
                break;
            };
        }
    };

    this.redraw = function () {
        this.clearContainer();
        for (var i = 0; i < this.targets.length; i++) {
            this.targets[i].draw();
        }
        for (var i = 0; i < this.answers.length; i++) {
            this.answers[i].draw();
        }
        for (var i = 0; i < this.targetsJustification.length; i++) {
            this.targetsJustification[i].draw();
        }
        for (var i = 0; i < this.answersJustification.length; i++) {
            this.answersJustification[i].draw();
        }
        reloadAllMathJax();
    };

    this.clearContainer = function () {
        this.answersContainer.html("");
        this.optionsContainer.html("");
        this.answersJustificationContainer.html("");
        this.optionsJustificationContainer.html("");
    };

    this.redraw();

};

var multipleDragAndDropOptionJ = function (parent, option) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = option;

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_OptionTemplateJ").html() : $("#multipleDragAndDrop_PreviewOptionTemplateJ").html();
        template = template.replace("{{option}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        var divId = this.parent.mode === 'edit' ? this.id : 100 + this.id;
        template = template.replace("{{div_id}}", 'do' + divId);
        template = template.replace("{{answerText}}", this.answerText ? this.answerText : '&nbsp;');
        this.parent.optionsContainer.html(this.parent.optionsContainer.html() + template);
        $(".multipleDragAndDrop_DeleteOption").click(function (event) {
            var id = $(this).attr('data-val');
            self.parent.deleteOption(parseInt(id));
        });
    };
};

var multipleDragAndDropOptionJustification = function (parent, option) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = option;

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_OptionJustificationTemplate").html() : $("#multipleDragAndDrop_PreviewOptionJustificationTemplate").html();
        template = template.replace("{{optionJustification}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        var divId = this.parent.mode === 'edit' ? this.id : 100 + this.id;
        template = template.replace("{{div_id_oj}}", 'doj' + divId);
        template = template.replace("{{answerJustificationText}}", this.answerText ? this.answerText : '&nbsp;');
        this.parent.optionsJustificationContainer.html(this.parent.optionsJustificationContainer.html() + template);
        $(".multipleDragAndDrop_DeleteOptionJustification").click(function (event) {
            var id = $(this).attr('data-val');
            self.parent.deleteOptionJustification(parseInt(id));
        });
    };
};

var multipleDragAndDropAnswerJ = function (parent, answer) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = answer;

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_AnswerTemplateJ").html() : $("#multipleDragAndDrop_PreviewAnswerTemplateJ").html();
        template = template.replace("{{answer}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        this.parent.answersContainer.html(this.parent.answersContainer.html() + template);
        $(".multipleDragAndDrop_DeleteAnswer").click(function () {
            var id = $(this).attr('data-val');
            self.parent.deleteAnswer(parseInt(id));
        });

        var appendTo = this.parent.mode === 'edit' ? "body" : "#multipleDragAndDrop_PreviewJ";
        $(".draggable-answer").draggable({
            appendTo: appendTo,
            helper: "clone",
            //drag: function (event, ui) {
            //    reloadAllMathJax();
            //}
        });
            
        $(".droppable-option").droppable({
            accept: ".draggable-answer",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var srcId = Number(ui.draggable[0].attributes["data-val"].nodeValue);
                var tgtId = Number(event.target.attributes["data-val"].nodeValue);
                var tgtDivId = event.target.attributes["id"].nodeValue;

                var src = null;
                for (var i = 0; i < self.parent.answers.length; i++) {
                    if (self.parent.answers[i].id === srcId) {
                        src = self.parent.answers[i];
                        break;
                    }
                }

                var tgt = null;
                for (var i = 0; i < self.parent.targets.length; i++) {
                    if (self.parent.targets[i].id === tgtId) {
                        tgt = self.parent.targets[i];
                        break;
                    }
                }

                tgt.answerId = srcId;
                tgt.answerText = src.text;
                $(event.target).html(src.text);
                reloadMathJax(tgtDivId);
            }
        });
    };
};

var multipleDragAndDropAnswerJustification = function (parent, answer) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = answer;

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_AnswerJustificationTemplate").html() : $("#multipleDragAndDrop_PreviewAnswerJustificationTemplate").html();
        template = template.replace("{{answer_justification}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id_aj}}", this.id);
        template = template.replace("{{id_aj}}", this.id);
        this.parent.answersJustificationContainer.html(this.parent.answersJustificationContainer.html() + template);
        $(".multipleDragAndDrop_DeleteAnswerJustification").click(function () {
            var id = $(this).attr('data-val');
            self.parent.deleteAnswerJustification(parseInt(id));
        });

        var appendTo = this.parent.mode === 'edit' ? "body" : "#multipleDragAndDrop_PreviewJ";
        $(".draggable-answer-j").draggable({
            appendTo: appendTo,
            helper: "clone",
        });

        $(".droppable-option-j").droppable({
            accept: ".draggable-answer-j",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var srcId = Number(ui.draggable[0].attributes["data-val"].nodeValue);
                var tgtId = Number(event.target.attributes["data-val"].nodeValue);
                var tgtDivId = event.target.attributes["id"].nodeValue;

                var src = null;
                for (var i = 0; i < self.parent.answersJustification.length; i++) {
                    if (self.parent.answersJustification[i].id === srcId) {
                        src = self.parent.answersJustification[i];
                        break;
                    }
                }

                var tgt = null;
                for (var i = 0; i < self.parent.targetsJustification.length; i++) {
                    if (self.parent.targetsJustification[i].id === tgtId) {
                        tgt = self.parent.targetsJustification[i];
                        break;
                    }
                }

                tgt.answerId = srcId;
                tgt.answerText = src.text;
                $(event.target).html(src.text);
                reloadMathJax(tgtDivId);
            }
        });
    };
};
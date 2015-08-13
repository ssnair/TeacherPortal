$(function () {
    var settings = settings || {
        targets: [],
        answers: []
    };

    var displayAnswersVertically;
    mddAllowedAnswers = [];

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
        displayAnswersVertically = settings.answers[0].DisplayAnswersVertically ? true : false;

        if (settings.answers[0].DisplayAnswersVertically == 1 && globalPageType == "View") {
            $("#divAnswersContainer").addClass("mddAnswerContainer");
            $("#divOptionsContainer").addClass("mddOptionContainer");

            $(".qeditor-answer").addClass("qeditor-answer-block");
            $(".qeditor-option").addClass("qeditor-option-block");

            $(".qeditor-answer").removeClass("qeditor-answer");
            $(".qeditor-option").removeClass("qeditor-option");
        }

        if (globalPageType == "Edit") {
            $("#cboxAnswersVertically").prop("checked", displayAnswersVertically);
        }
    }

    var multipleDragAndDrop = new MultipleDragAndDrop('edit', settings);
    var multipleDragAndDropPreview = null;

    createAllowedAnswers();

    $("#multipleDragAndDrop_AddAnswer").click(function () {
        if (true) {   
            if (!validateEmptyQuestionText(hfAnswerEditor.value))
                return;

            var answer = hfAnswerEditor.value;
            multipleDragAndDrop.addAnswer(answer);
            $("#divAnswerEditor").html('<span>Click to edit...</span>');
            $("#divAnswerEditor").next().val('<span>Click to edit...</span>');
        }
    });

    $("#multipleDragAndDrop_AddOption").click(function () {
        if (true) {   // add Validation here
            if (!validateEmptyQuestionText(hfOptionEditor.value))
                return;

            var option = hfOptionEditor.value;
            multipleDragAndDrop.addOption(option);
            $("#divOptionEditor").html('<span>Click to edit...</span>');
            $("#divOptionEditor").next().val('<span>Click to edit...</span>');
        }
    });

    $("#btnMultipleDragAndDrop_Preview").click(function () {
        var settings = {
            answers: [],
            targets: [],
            expectedAnswers: []
        }

        for (var i = 0; i < multipleDragAndDrop.targets.length; i++) {
            settings.targets.push({
                text: multipleDragAndDrop.targets[i].text,
                id: multipleDragAndDrop.targets[i].id
            });
            settings.expectedAnswers.push({
                optionId: multipleDragAndDrop.targets[i].id,
                answerId: multipleDragAndDrop.targets[i].answerId
            });
        };

        for (var i = 0; i < multipleDragAndDrop.answers.length; i++) {
            settings.answers.push({
                text: multipleDragAndDrop.answers[i].text,
                id: multipleDragAndDrop.answers[i].id
            });
        };

        multipleDragAndDropPreview = new MultipleDragAndDrop('preview', settings);

        var editor = hfQBody.value;

        $('#multipleDragAndDrop_questionContainer').html(editor);
        $("#multipleDragAndDrop_result").html('');

        // display answers vertically
        if ($('#cboxAnswersVertically:checked').val() ? 1 : 0 == 1) {
            $('#multipleDragAndDropPreviewContainer').addClass("mddAnswerContainer");
            $('#multipleDragAndDropOptionsPreviewContainer').addClass("mddOptionContainer");

            $('#MultipleDragAndDropPreviewAnswers').find('div.draggable-answer').addClass("qeditor-answer-block");
            $('#MultipleDragAndDropPreviewOptions').find('div.qeditor-option').addClass("qeditor-option-block");
            $('#MultipleDragAndDropPreviewOptions').find('div.qeditor-option').removeClass("qeditor-option");

            displayAnswersVertically = true;
        }
        else {
            displayAnswersVertically = false;
        }
    });

    $("#multipleDragAndDrop_submitAnswer").click(function () {
        var result = true;
        for (var i = 0; i < multipleDragAndDropPreview.targets.length; i++) {
            var option = multipleDragAndDropPreview.targets[i];
            for (var i = 0; i < multipleDragAndDropPreview.settings.expectedAnswers.length; i++) {
                if (multipleDragAndDropPreview.settings.expectedAnswers[i].optionId == option.id) {
                    result = option.answerId === multipleDragAndDropPreview.settings.expectedAnswers[i].answerId;
                    break;
                }
            }
            if (!result) {
                break;
            }
        }

        if (result)
            $('#multipleDragAndDrop_result').html('<img src="/onlinedw/Content/images/win.png" width="50" height="50"/>')
        else
            $('#multipleDragAndDrop_result').html('<img src="/onlinedw/Content/images/lose.png" width="50" height="50"/>')
    });

    $("#multipleDragAndDrop_closeModal").on('click', function () {
        $('#multipleDragAndDrop_Preview').modal('hide');
        // make the drap and drop work
        multipleDragAndDrop.redraw();

        $("#cboxAnswersVertically").prop("checked", displayAnswersVertically);
    });

    $("#bntMultipleDragAndDrop_Save").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;
        
        var answers = [];
        for (i = 0; i < multipleDragAndDrop.answers.length; i++) {
            answers.push({ id: i + 1, text: multipleDragAndDrop.answers[i].text, DisplayAnswersVertically: $('#cboxAnswersVertically:checked').val() ? 1 : 0 });
        }

        targets = [];
        var targetAnswersAll = [];
        var targetAnswers = [];
        var targetId = 0;

        for (i = 0; i < multipleDragAndDrop.targets.length; i++) {
            targetAnswersAll.length = 0;
            targetAnswers.length = 0;
            targetId = 0;

            for (var j = 0; j < answers.length; j++) {
                if (targetId > 0) { break; };

                for (var z = 0; z < mddAllowedAnswers.length; z++) {
                    // the OR (||) is needed because the new answers (added on edit) on mddAllowedAnswers[] have the long AanswerId (486993, etc.) but 
                    // the existing answers (loaded from the db) have the sequencial number (1, 2, 3, etc.)
                    if (multipleDragAndDrop.answers[j].id === mddAllowedAnswers[z].AnswerId || answers[j].id == mddAllowedAnswers[z].AnswerId) {
                        if (multipleDragAndDrop.targets[i].id === mddAllowedAnswers[z].TargetId) {
                            // get the allowed answers for this target
                            targetAnswersAll = $.grep(mddAllowedAnswers, function (el, idx) { return el.TargetId == mddAllowedAnswers[z].TargetId; });
                            targetId = mddAllowedAnswers[z].TargetId;
                            break;
                        }
                    }
                }
            }

            // let's create the targetAnswers array (only has AnswerId, AnswerText)
            for (var k = 0; k < targetAnswersAll.length; k++) {
                //targetAnswers.push({ AnswerId: targetAnswersAll[k].AnswerId, AnswerText: targetAnswersAll[k].AnswerText });
                targetAnswers.push({ AnswerId: k + 1, AnswerText: targetAnswersAll[k].AnswerText });
            }

            // cloning the array to get a deep copy
            var clonedTargetAnswers = jQuery.extend(true, [], targetAnswers);

            targets.push({ id: i + 1, text: multipleDragAndDrop.targets[i].text, answers: clonedTargetAnswers });
        }

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 48,   // Multiple drag and drop 2
            questionText: specialTrim(hfQBody.value),
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
            "/OnlineDW/home/MultipleDragAndDrop2_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',48', '*');
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
    });

});

MultipleDragAndDrop = function (mode, settings) {
    settings = settings || {
        targets: [],
        answers: []
    };

    this.mode = mode;

    this.settings = JSON.parse(JSON.stringify(settings));

    this.targets = [];
    this.answers = [];
    
    for (var i = 0; i < settings.targets.length; i++) {
        var option = new multipleDragAndDropOption(this, settings.targets[i].text);
        option.id = settings.targets[i].id;
        option.answerId = settings.targets[i].answerId;
        option.answerText = settings.targets[i].answerText;
        this.targets.push(option);
    }

    for (var i = 0; i < settings.answers.length; i++) {
        var answer = new multipleDragAndDropAnswer(this, settings.answers[i].text);
        answer.id = settings.answers[i].id;
        this.answers.push(answer);
    }

    if (mode === 'edit') {
        this.answersContainer = $("#MultipleDragAndDropAnswers");
        this.optionsContainer = $("#MultipleDragAndDropOptions");
    } else if (mode === 'preview') {
        this.answersContainer = $("#MultipleDragAndDropPreviewAnswers");
        this.optionsContainer = $("#MultipleDragAndDropPreviewOptions");
    }

    
    this.addAnswer = function (answer) {
        var newAnswer = new multipleDragAndDropAnswer(this, answer);
        this.answers.push(newAnswer);
        this.redraw();
    };

    this.addOption = function (option) {
        var newOption = new multipleDragAndDropOption(this, option);
        this.targets.push(newOption);
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

    this.redraw = function () {
        this.clearContainer();
        for (var i = 0; i < this.targets.length; i++) {
            this.targets[i].draw();
        }
        for (var i = 0; i < this.answers.length; i++) {
            this.answers[i].draw();
        }
        // create allowed answers for every answer
        var tgtId_srcId = [];
        var tgtId = "";
        var srcId = "";
        var srcTxt = "";
        for (var i = 0; i < mddAllowedAnswers.length; i++) {
            srcTxt = mddAllowedAnswers[i].AnswerText;
            // the id field has the tgtId and the srcId with the formart "tgtId_srcId"
            tgtId_srcId = mddAllowedAnswers[i].id.split("_");
            tgtId = tgtId_srcId[0];
            srcId = tgtId_srcId[1];

            createAllowedAnswer(tgtId, srcId, srcTxt, false);

            tgtId_srcId.length = 0;
        }

        reloadAllMathJax();
    };

    this.clearContainer = function () {
        this.answersContainer.html("");
        this.optionsContainer.html("");
    };

    this.redraw();

};

var multipleDragAndDropOption = function(parent, option) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = option;
    this.answers = new Array();

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_OptionTemplate").html() : $("#multipleDragAndDrop_PreviewOptionTemplate").html();
        template = template.replace("{{option}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        var divId = this.parent.mode === 'edit' ? this.id : 100 + this.id;
        template = template.replace("{{div_id}}", 'do' + divId);
        template = template.replace("{{span_id}}", 'span' + divId);
        template = template.replace("{{answerText}}", this.answerText ? this.answerText : '&nbsp;');
        this.parent.optionsContainer.html(this.parent.optionsContainer.html() + template);
        $(".multipleDragAndDrop_DeleteOption").click(function (event) {
            var id = $(this).attr('data-val');
            self.parent.deleteOption(parseInt(id));
        });
    };
};

var multipleDragAndDropAnswer = function (parent, answer) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = answer;

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_AnswerTemplate").html() : $("#multipleDragAndDrop_PreviewAnswerTemplate").html();
        template = template.replace("{{answer}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        this.parent.answersContainer.html(this.parent.answersContainer.html() + template);
        $(".multipleDragAndDrop_DeleteAnswer").click(function () {
            var id = $(this).attr('data-val');
            self.parent.deleteAnswer(parseInt(id));
        });

        var appendTo = this.parent.mode === 'edit' ? "body" : "#multipleDragAndDrop_Preview";
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
                // add allowed answers
                createAllowedAnswer(tgtId, srcId, src.text)
                //tgt.answers.push({ id: srcId, text: src.text })
                reloadMathJax(tgtDivId);
            }
        });
      
    };
};

function createAllowedAnswer(tgtId, srcId, srcTxt, addAnswer) {
    addAnswer = typeof addAnswer !== 'undefined' ? addAnswer : true;

    var anchorDeleteAnswer = "a_" + tgtId + "_" + srcId + "_" + Math.floor((Math.random() * 1000) + 1);
    var url = "javascript: deleteAllowedAnswer('" + anchorDeleteAnswer + "', '" + tgtId + "', '" + srcId + "');"
    var aText = "Del";
    //$("#span" + tgtId).append('<div style="display: inline-block;">' + srcTxt + ' <a id="' + anchorDeleteAnswer + '"href="' + url + '">' + aText + '</a>');
    $("#span" + tgtId).append('<div style="display: inline-block; width: 96%;">' + srcTxt + ' <a id="' + anchorDeleteAnswer + '"href="' + url + '"' + 'style="float:right; margin-right: 10px;">' + aText + '</a>');

    if (addAnswer) {
        var allowedAnswerId = tgtId + "_" + srcId;
        mddAllowedAnswers.push({ id: allowedAnswerId, TargetId: tgtId, AnswerId: srcId, AnswerText: srcTxt });
    }

    //$("#" + anchorDeleteAnswer).prev().css("float", "left");
    $("#" + anchorDeleteAnswer).prev().css("display", "inline-block");
    return false;
}

function deleteAllowedAnswer(id, tgtId, srcId) {
    $("#" + id).parent().remove()

    var allowedAnswerId = tgtId + "_" + srcId;
    mddAllowedAnswers = $.grep(mddAllowedAnswers, function (el, idx) { return el.id == allowedAnswerId }, true)

    return false;
}

// load saved Allowed Answers (Edit mode)
function createAllowedAnswers() {
    if (typeof globalSettings !== 'undefined') {
        for (var i = 0; i < globalSettings.targets.length; i++) {
            for (var j = 0; j < globalSettings.targets[i].Answers.length; j++) {
                createAllowedAnswer(globalSettings.targets[i].id, globalSettings.targets[i].Answers[j].AnswerId, globalSettings.targets[i].Answers[j].AnswerText);
            }
        }
    }
}
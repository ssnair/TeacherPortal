$(function () {
    var settings = settings || {
        targets: [],
        answers: []
    };

    var displayAnswersVertically;

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

    $("#multipleDragAndDrop_AddAnswer").click(function () {
        if (true) {   
            if (!validateEmptyQuestionText(hfAnswerEditor.value))
                return;

            var answer = hfAnswerEditor.value;
            multipleDragAndDrop.addAnswer(answer);
            //ckEditor21.setData('');
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
            //ckEditor22.setData('');
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
        
        // TODO: IL - remove hardcoded answers vertically
        var answers = [];
        for (i = 0; i < multipleDragAndDrop.answers.length; i++) {
            answers.push({ id: i + 1, text: multipleDragAndDrop.answers[i].text, DisplayAnswersVertically: $('#cboxAnswersVertically:checked').val()?1:0 });
        }

        targets = [];
        for (i = 0; i < multipleDragAndDrop.targets.length; i++) {
            var answerIndex = -1;
            for (var j = 0; j < answers.length; j++) {
                if (multipleDragAndDrop.answers[j].id === multipleDragAndDrop.targets[i].answerId) {
                    answerIndex = j;
                    break;
                }
            }
            targets.push({ id: i + 1, text: multipleDragAndDrop.targets[i].text, answerId: answerIndex == -1 ? 0 : answers[answerIndex].id, answerText: answerIndex == -1 ? '' : answers[answerIndex].text });
        }

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 40,   // Multiple drag and drop
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
            "/OnlineDW/home/MultipleDragAndDrop_Save",
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
    });

    //// dblclick event for the answer containers (a div with class .draggable-answer)
    //$("#MultipleDragAndDropAnswers").on('dblclick', ".draggable-answer", function (event) {
    //    ckEditor21.setData(this.innerHTML);
    //});

    //$("#MultipleDragAndDropOptions").on('drop', ".droppable-option", function (event) {
    //    reloadAllMathJax();
    //});

    //$('.droppable-option').droppable({
    //    drop: function (event, ui) {
    //        $(this)
    //            //.find("draggable-answer")
    //                reloadAllMathJax();
    //    }
    //});

    //$("#MultipleDragAndDropOptions").on("drop", ".droppable-option", function (event, ui) {
    //    reloadAllMathJax();
    //});

    //$(function () {
    //    $("#MultipleDragAndDropOptions .droppable-option").droppable({
    //        drop: function (event, ui) {
    //            $(this)
    //              //.addClass("ui-state-highlight")
    //              .find("draggable-answer")
    //                reloadAllMathJax();;
    //        }
    //    });
    //});

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

    this.draw = function () {
        var self = this;
        var template = this.parent.mode === 'edit' ? $("#multipleDragAndDrop_OptionTemplate").html() : $("#multipleDragAndDrop_PreviewOptionTemplate").html();
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
                reloadMathJax(tgtDivId);
            }
        });
      
    };
};

$(window).load(function () {
    // patch to fix issue with 'fuzzy' images created using CodeCogs Math Editor
    $('.draggable-answer img').each(function () {
        $(this).addClass("codecogs_math");
        $(this).html($(this).html());
    });
});
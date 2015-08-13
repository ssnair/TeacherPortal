$(function () {
    var count = 1;
    var do_score = 0;
    var do_totalScore = 0;
    var count_score = 0;
    var container = $("#DragOrderContainer");


    var tbAnswers = [];
    var tbAnswersPreview = [];
    var selected_index = -1;

    //Check the content of tbAnswers
    if (tbAnswers == null) {
        tbAnswers = [];
    }
    else {
        count = tbAnswers.length + 1;
    }

    //Method to add a new answer
    function getQuestion() {
        //var questionText = $('#questionText').val();
        var questionText = hfQBody.value;
        var note = $("#Note").val();
        var worth = $("#worth").val();
        var listAnswers = tbAnswers;

        return (questionText == "") ? null : { QuestionText: questionText, Note: note,Worth:worth, List:tbAnswers};
    }

    function addAnswer(id) {
        //return doAddAnswer(id, $('#txtAnswer').val(), $('#txtWorth').val());
        return doAddAnswer(id, $('#txtAnswer').val(), 1);
    };

    function doAddAnswer(id, text, worth) {
        var answer = {
            Id: id,
            Text: text,
            Worth: worth
        };

        tbAnswers.push(answer);
        return true;
    }

    List();

    //Method to delete answer
    function deleteAnswer() {
        tbAnswers.splice(selected_index, 1);
    }

    function List() {
        if (typeof globalPageType !== 'undefined' && globalPageType == "View") {
            // VIEW page: construct the ANSWERS without the DELETE button 
            ListAnswersView();
            return;
        }

        // EDIT page: construct the ANSWERS with the DELETE button
        var bodyContainer = $('#body-answer');

        bodyContainer.html('');

        bodyContainer.append('<ul id="listSortable"></ul>');

        for (var i = 0; i < tbAnswers.length; i++) {
            var ans = tbAnswers[i];
            $('#listSortable').append('<li id="' + ans.Id + '"><p>' + ans.Text + '</p>' +
                '<a href="#" alt="Delete" class="btnDelete">Delete</a></li>');
        }

        $('#listSortable').sortable({
            update: function (event, ui) {

                tbAnswers = [];
                $('#listSortable li').each(function (e) {

                    var answer = {
                        Id: $(this).attr('id'),
                        Text: $(this).children('p').text()
                    };

                    tbAnswers.push(answer);
                });
            }
        });

        $('.btnDelete').click(function () {
            selected_index = parseInt($(this).parent().attr("id"));

            for (var i in tbAnswers) {
                var ans = tbAnswers[i];

                if (ans.Id == selected_index) {
                    selected_index = i;
                    break;
                }
            }

            deleteAnswer();
            List();
        });

    }

    // create the answers without the DELETE button
    function ListAnswersView() {
        var bodyContainer = $('#body-answer');

        bodyContainer.html('');

        bodyContainer.append('<ul id="listSortable"></ul>');

        for (var i = 0; i < tbAnswers.length; i++) {
            var ans = tbAnswers[i];
            $('#listSortable').append('<li id="' + ans.Id + '"><p>' + ans.Text + '</p></li>');
        }

        $('#listSortable').sortable({
            update: function (event, ui) {

                tbAnswers = [];
                $('#listSortable li').each(function (e) {

                    var answer = {
                        Id: $(this).attr('id'),
                        Text: $(this).children('p').text()
                    };

                    tbAnswers.push(answer);
                });
            }
        });
    }

    function ListPreview() {
        var previewContainer = $('#containerPreview');

        previewContainer.html('');

        previewContainer.append('<ul id="listPreview"></ul>');

        var questionText = $('#questionText').val();
        //var questionText = ckEditor.val();
        $('#pQuestionPreview').html('');
        $('#pQuestionPreview').append(questionText);

        for (var i = 0; i < tbAnswersPreview.length; i++) {
            var ans = tbAnswersPreview[i];
            $('#listPreview').append('<li id="' + ans.Id + '"><p>' + ans.Text + '</p></li>');
        }

        $('#listPreview').sortable({
            containment: '#cont-modal-body', scroll: false,
            update: function (event, ui) {

                tbAnswersPreview = [];
                $('#listPreview li').each(function (e) {

                    var answer = {
                        Id: $(this).attr('id'),
                        Text: $(this).children('p').text()
                    };

                    tbAnswersPreview.push(answer);
                });
            }
        });
    }

    function randomQuestion(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function isMatch(array, arrayCompare) {
        for (var i = 0; i < tbAnswers.length; i++) {
            var ans = tbAnswers[i];
            var anscompare = tbAnswersPreview[i];
            if (ans.Id == anscompare.Id) {
                do_score = do_score + parseInt(ans.Worth);
                count_score++;
            }

            do_totalScore = do_totalScore + parseInt(ans.Worth);
        }
        return do_score;
    }

    $('#btnAdd').click(function () {
        var filter = /^[0-9-+]+$/;
        $('#smsError').empty();
        //if ($('#txtAnswer').val() == "" || $('#txtWorth').val() == "") {
        if ($('#txtAnswer').val() == "") {
            $('#smsError').text('You must fill the answer!');
        }
        else {

            //if (filter.test($('#txtWorth').val())) {

            addAnswer(count);
            List();
            count++;

            $('#txtAnswer').val("");
            //$('#txtWorth').val("");
            $('#txtAnswer').focus();
            //}
            //else {
            //    $('#smsError').text('You must fill only numbers');

            //}

        }
    });

    $('#btnModalPreview').click(function () {
        var tbAnswersCloned = tbAnswers.slice();
        tbAnswersPreview = randomQuestion(tbAnswersCloned);
        ListPreview();
    });

    $('#btnDragAndOrder_Save').click(function () {
        //if (!validateEmptyQuestionText(ckEditor.getData()))
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        var options = [];
        for (var i = 0; i < tbAnswers.length; i++) {
            options.push({
                id: tbAnswers[i].Id,
                text: tbAnswers[i].Text,
                worth: tbAnswers[i].Worth
            });
        }

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 50,
            //questionText: specialTrim($('#questionText').ckEditor().editor.getData()),
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#txtNote").val(),
            statusId: 1,
            approveUser: null,
            options: options
        };

        $.post(
            "/onlinedw/home/DragAndOrder_Save",
            $.toDictionary(request), 
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',50', '*');
                //BootstrapDialog.show({
                //    type:  BootstrapDialog.TYPE_SUCCESS,
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
            'json');
    });

    $('#submitAnswer').click(function () {

        var resultado = isMatch(tbAnswers, tbAnswersPreview);

        //calculate the score for each correct answer

        if (resultado != 0) {
            $('#msgResult').html('<p>Correct answers: ' + count_score + '<br/>Your Score is: ' + resultado + ' / ' + do_totalScore + '</p>');
            $('#msgResult').append('<img src="images/win.png" width="50" height="50"/>')
        }
        else {
            $('#msgResult').html('<p>Correct answers: ' + count_score + '<br/>Your Score is: ' + resultado + ' / ' + do_totalScore + '</p>');
            $('#msgResult').append('<img src="images/lose.png" width="50" height="50"/>')
        }

        do_score = 0;
        count_score = 0;
        do_totalScore = 0;
    });

    $("#closeModal").on('click', function () {
        $('#basicModal').modal('hide');
        $('#msgResult').html('');
        $('pQuestionPreview').remove();
    });

    // run
    var settings = settings || {
        options: []
    };

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
    }

    var startDO = new DragOrder(container, settings);

    for (var i = 0; i < settings.options.length; i++) {
        doAddAnswer(settings.options[i].id,
        settings.options[i].text,
        settings.options[i].worth);
    }
    List();
});

function DragOrder(container, settings) {
    this.init(container, settings);
}

DragOrder.prototype.init = function (container, settings) {
    var defaultvalues = null;
    this.createPaper(container, settings);
   
    this.createMessageView(container);
}

DragOrder.prototype.createPaper = function (container, settings) {

    container.append('<div id="sub-contanier" class="container"></div>');

}

// To Show the Modal View
DragOrder.prototype.createMessageView = function (container) {
    container.append('<div class="modal fade bs-example-modal-msg" data-backdrop="static" data-keyboard="false">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '       <div class="modal-header">' +
        '           <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '           <h4 class="modal-title">Question Message</h4>' +
        '       </div>' +
        '       <div class="modal-body">' +
        '           <p id="do_msgResult">Your message goes here</p>' +
        '       </div>' +
        '       <div class="modal-footer">' +
        '           <!-- button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '           <button type="button" class="btn btn-primary">Save changes</button -->' +
        '       </div>' +
        '   </div>' +
        '</div>' +
    '</div>');
}
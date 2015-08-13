$(function () {
    var settings = settings || {
        answers: []
    };

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
    }

    // setup event handlers 
    $("#multipleDragAndDropImage_AddAnswer").on('change', function (event) {

        //alert("event listener working");
        var imgId = '';
        var randonNumber = 0;

        var files = event.target.files   // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var span1 = $('<span />');

                    // get the file name without the extension and add a randon number to use it as Id
                    randonNumber = Math.floor((Math.random() * 999999) + 1)
                    imgId = theFile.name;
                    imgId = imgId.substring(0, imgId.lastIndexOf(".")) + randonNumber;

                    // create a div container, the image and a link that will delete the div (contains the image and the link)
                    span1.innerHTML = ['<div class="qeditor-answer" draggable="true" id="div', randonNumber, '"><img class="thumb" draggable="false" src="', e.target.result, '" title="', escape(theFile.name), '" id="', escape(imgId), '"/><div><a id="a', randonNumber, '" href="javascript:void(0)">Delete</a></div></div>'].join('');
                    $("#MultipleDragAndDropImageAnswers").append(span1.innerHTML);

                    // add the ondragstart event to the div
                    $("#div" + randonNumber).on('dragstart', function (evt) {
                        drag(evt);
                    });

                    // add the click event to the link (a) - it will remove the div (contains the image and the link)
                    //$("#a" + randonNumber).on('click', function (evt) {
                    //    $("#div" + randonNumber).remove();
                    //});
                };
            })(f);

            // Read in the image file as a data URL
            reader.readAsDataURL(f);
        }
    });

    // dragover and drop events for the image containers
    $("#MultipleDragAndDropImageAnswers").on('dragover', function (event) {
        allowDrop(event);
    });

    $("#MultipleDragAndDropImageAnswers").on('drop', function (event) {
        drop(event);
    });

    $("#MultipleDragAndDropImageCorrectAnswers").on('dragover', function (event) {
        allowDrop(event);
    });

    $("#MultipleDragAndDropImageCorrectAnswers").on('drop', function (event) {
        drop(event);
    });

    // dragover and drop events for the image preview containers
    $("#MultipleDragAndDropImagePreviewAnswers").on('dragover', function (event) {
        allowDrop(event);
    });

    $("#MultipleDragAndDropImagePreviewAnswers").on('drop', function (event) {
        drop(event);

        // remove the delete links
        $("#MultipleDragAndDropImagePreviewAnswers a").remove();
    });

    $("#MultipleDragAndDropImagePreviewCorrectAnswers").on('dragover', function (event) {
        allowDrop(event);
    });

    $("#MultipleDragAndDropImagePreviewCorrectAnswers").on('drop', function (event) {
        drop(event);

        // remove the delete links
        $("#MultipleDragAndDropImagePreviewCorrectAnswers a").remove();
    });

    // add the click event to the link (a) - it will remove the div (contains the image and the link)
    $("#MultipleDragAndDropImageAnswers").on('click', "a", function (event) {
        event.preventDefault();
        $(this).parents(':eq(1)').remove();
    });

    $("#MultipleDragAndDropImageCorrectAnswers").on('click', "a", function (event) {
        event.preventDefault();
        $(this).parents(':eq(1)').remove();
    });

    // ondragstart event for the image containers (a div with class .qeditor-answer)
    $("#MultipleDragAndDropImageAnswers").on('dragstart', ".qeditor-answer", function (event) {
        drag(event);
    });

    $("#MultipleDragAndDropImageCorrectAnswers").on('dragstart', ".qeditor-answer", function (event) {
        drag(event);
    });

    // ondragstart event for the image preview containers (a div with class .qeditor-answer)
    $("#MultipleDragAndDropImagePreviewAnswers").on('dragstart', ".qeditor-answer", function (event) {
        drag(event);
    });

    $("#MultipleDragAndDropImagePreviewCorrectAnswers").on('dragstart', ".qeditor-answer", function (event) {
        drag(event);
    });

    // helper functions for drag and drop
    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.originalEvent.dataTransfer.setData("text/html", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.originalEvent.dataTransfer.getData("text/html");
        if (ev.target.tagName == 'IMG') {
            // do not allow to drop one image into another
            return;
        }
        ev.target.appendChild(document.getElementById(data));
    }

    // save
    $("#bntMultipleDragAndDropImage_Save").click(function () {
        // return if the question text was not entered
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        var answers = [];

        // get incorrect answers
        $("#MultipleDragAndDropImageAnswers img").each(function () {

            answers.push({imgName: $(this).attr('title'), imgData: $(this).attr('src'), imgURL: null ,isCorrect: 0 });
        });

        // get correct answers
        $("#MultipleDragAndDropImageCorrectAnswers img").each(function () {

            answers.push({ imgName: $(this).attr('title'), imgData: $(this).attr('src'), imgURL: null, isCorrect: 1 });
        });

        // return if no answers were entered
        if (!validateAnswersEntered(answers.length))
            return;

        // create request to sent back to the controller
        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 42,   // Multiple drag and drop
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#multipleDragAndDropImage_Notes").val(),
            statusId: 1,
            approveUser: null,
            answers: answers
        };

        // post back to the controller
        $.post(
            "/OnlineDW/home/MultipleDragAndDropImage_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',42', '*');
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
        .fail(function () {
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

    // preview
    $("#btnMultipleDragAndDropImage_Preview").click(function () {
        $("#MultipleDragAndDropImagePreviewAnswers").html($("#MultipleDragAndDropImageAnswers").html());
        $("#MultipleDragAndDropImagePreviewCorrectAnswers").html($("#MultipleDragAndDropImageCorrectAnswers").html());

        // add Preview to the id name
        $('#MultipleDragAndDropImagePreviewAnswers').find('.qeditor-answer').each(function () {
            this.id = this.id + 'Preview';
        });

        $('#MultipleDragAndDropImagePreviewCorrectAnswers').find('.qeditor-answer').each(function () {
            this.id = this.id + 'Preview';
        });

        //$("#MultipleDragAndDropImagePreviewAnswers .qeditor-answer").attr('id', $("#MultipleDragAndDropImagePreviewAnswers .qeditor-answer").attr('id') + 'Preview')
        //$("#MultipleDragAndDropImagePreviewCorrectAnswers .qeditor-answer").attr('id', $("#MultipleDragAndDropImagePreviewCorrectAnswers .qeditor-answer").attr('id') + 'Preview')

        // remove the delete links
        $("#MultipleDragAndDropImagePreviewAnswers a").remove();
        $("#MultipleDragAndDropImagePreviewCorrectAnswers a").remove();

        var editor = hfQBody.value;

        $('#multipleDragAndDropImage_questionContainer').html(editor);

    });

    $("#multipleDragAndDropImage_closeModal").on('click', function () {
        $('#multipleDragAndDropImage_Preview').modal('hide');
    });

}); // end of $(function ()

// returns true if an answer was entered
function validateAnswersEntered(numAnswers) {
    if (numAnswers === null || numAnswers === 0) {
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_WARNING,
            title: 'Information',
            message: 'You can\'t leave the Answers empty!',
            buttons: [{
                label: 'Ok',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }]
        });
        return false;
    }
    return true;
}




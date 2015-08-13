$(function(){
    /*dmd : dragmultipledrop*/
    var dmd_count = 1;
    var dmd_container = $("#DragMultipleDropContainer");
    var dmd_start = new DragMultipleDrop(dmd_container);

    //Default values to save data in a localStorage
    var dmd_tbAnswers = localStorage.getItem("dmd_tbAnswers");
    var dmd_tbPreviewDroppableList = [];
    var dmd_tbPreviewDraggable = [];
    var dmd_selected_index = -1;

    dmd_tbAnswers = JSON.parse(dmd_tbAnswers);

    //Check the content of tbAnswers
    if(dmd_tbAnswers == null){
        dmd_tbAnswers = [];
    }
    else{
        dmd_count = dmd_tbAnswers.length + 1;
    }

    //Method to add a new answer
    function dmd_addAnswer(id){
        var answer = JSON.stringify({
            Id : id,
            Text : $('#dmd_txtAnswer').val()
        });

        dmd_tbAnswers.push(answer);
        localStorage.setItem("dmd_tbAnswers",JSON.stringify(dmd_tbAnswers));
        return true;
    }
    dmd_List();

    //Method to delete answer
    function dmd_deleteAnswer() {
        dmd_tbAnswers.splice(selected_index, 1);
        localStorage.setItem("dmd_tbAnswers", JSON.stringify(dmd_tbAnswers));
    }

    function dmd_List() {
        var bodyContainer = $('#dmd_body-answer');

        bodyContainer.html('');

        bodyContainer.append('<ul id="dmd_listSortable"></ul>');

        for(var i in dmd_tbAnswers){
            var ans = JSON.parse(dmd_tbAnswers[i]);
            $('#dmd_listSortable').append('<li id="dmd'+ans.Id+'"><p>'+ans.Text+'</p>' +
                '<a href="#" alt="Delete" class="dmd_btnDelete">Delete</a></li>');
        }

        $('#dmd_listSortable').sortable({
            update: function (event, ui) {

                dmd_tbAnswers = [];
                $('#dmd_listSortable li').each(function(e){
                    var idText = $(this).attr('id').toString();
                    var answer = JSON.stringify({
                        Id : idText.substring(idText.length-1,idText.length),
                        Text : $(this).children('p').text()
                    });

                    dmd_tbAnswers.push(answer);
                });
                localStorage.setItem("dmd_tbAnswers", JSON.stringify(dmd_tbAnswers));
            }
        });

        $('.dmd_btnDelete').click(function(){
            selected_index = parseInt($(this).parent().attr("id"));

            for(var i in dmd_tbAnswers){
                var ans = JSON.parse(dmd_tbAnswers[i]);

                if(ans.Id == selected_index){
                    selected_index = i;
                    break;
                }
            }

            dmd_deleteAnswer();
            dmd_List();
        });
    }

    function dmd_ListPreview() {
        var draggableContainer = $('#dmd_droppableContainer');
        var imageContainer = $('#dmd_imageContainer');
        var sortableContainer = $('#dmd_sortableContainer');

        draggableContainer.html('');
        imageContainer.html('');
        sortableContainer.html('');

        imageContainer.append('<p>The image go here!</p>');
        draggableContainer.append('<p>The droppable content goes here!</p>');
        sortableContainer.append('<p>All sortable content goes here!</p>');

        draggableContainer.append('<ul id="dmd_listDraggable"></ul>');
        sortableContainer.append('<ul id="dmd_listDroppable"></ul>');

        $('#dmd_pQuestionPreview').html('');
        $('#dmd_pQuestionPreview').append('Here go the question!');

        for(var i in dmd_tbPreviewDraggable){
            var ans = JSON.parse(dmd_tbPreviewDraggable[i]);
            $('<li>' + ans.Text + '</li>').data('number', ans.Id).attr('id', 'card'+ans.Id).appendTo('#dmd_listDraggable').draggable({
                stack: '#dmd_listDraggable li',
                helper: 'clone',
                cursor: 'move',
                revert: true,
                start: function(event, ui){
                    activeBoxDrop(true);
                },
                stop: function (event, ui) {
                    activeBoxDrop(false)
                }
            });
        }

        for(var i in dmd_tbPreviewDraggable){
            var ans = JSON.parse(dmd_tbPreviewDraggable[i]);

            $('<li> Empty box! <br/> Drag your answer here!</li>').data('number',ans.Id).appendTo('#dmd_listDroppable').droppable({
                accpet: '#dmd_listDraggable li',
                hoverClass: 'hovered',
                drop: handleDropAdd
            });
        }
    }

    function handleDropAdd(event, ui){
        $(this).css('visibility','hidden');
        $(this).attr('id',ui.draggable.data('number'));
        ui.draggable.draggable();
        $(this).droppable('disable');
        ui.draggable.position({of: $(this), my: 'left top', at: 'left top'});
        ui.draggable.draggable('option','revert', false);

        dmd_tbPreviewDroppableList = [];
        $('#dmd_listDroppable li').each(function(e){
            var answer = JSON.stringify({
                Id : $(this).attr('id')
            });

            dmd_tbPreviewDroppableList.push(answer);
        });
    }

    function isMatch(array, arrayCompare){
        for(var i in dmd_tbAnswers){
            var ans = JSON.parse(dmd_tbAnswers[i]);
            var anscompare = JSON.parse(dmd_tbPreviewDroppableList[i]);

            if(ans.Id != anscompare.Id){return false;}
        }
        return true;
    }

    function randomQuestion(array) {
        var currentIndex = array.length , temporaryValue , randomIndex  ;

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

    function activeBoxDrop(value){
        if(value == true){
            $('#dmd_listDroppable li').each(function(){
                $(this).addClass('activeDroppable').html('Empty!<br/>Drop here!');
            });
        }
        else{
            $('#dmd_listDroppable li').each(function(){
                $(this).removeClass('activeDroppable');
            });
        }
    }

    $('#dmd_btnAdd').click(function(){
        if($('#dmd_txtAnswer').val() == "")
        {
            $('#dmd_smsError').append('You must fill the answer!').css('color','red');;
        }
        else
        {
            $('#dmd_smsError').remove();
            dmd_addAnswer(dmd_count);
            dmd_List();
            dmd_count++;
        }
    });

    $('#dmd_submitAnswer').click(function () {

        var resultado = isMatch(dmd_tbAnswers, dmd_tbPreviewDroppableList);

        if(resultado){
            $('#dmd_msgResult').html('Correct!');
            $('#dmd_msgResult').append('<img src="../Content/images/win.png" width="50" height="50"/>')
        }
        else{
            $('#dmd_msgResult').html('Incorrect!');
            $('#dmd_msgResult').append('<img src="../Content/images/lose.png" width="50" height="50"/>')
        }
    });

    $('#dmd_btnModalPreview').click(function(){
        var tbAnswersCloned = dmd_tbAnswers.slice();
        dmd_tbPreviewDroppableList = dmd_tbAnswers.slice();
        dmd_tbPreviewDraggable = randomQuestion(tbAnswersCloned);

        dmd_ListPreview();
    });

    $("#dmd_closeModal").on('click', function () {
        $('#dmd_basicModal').modal('hide');
        $('#dmd_msgResult').html('');
        $('dmd_pQuestionPreview').remove();
    });
});

function DragMultipleDrop(container){
    this.init(container);
}

DragMultipleDrop.prototype.init = function(container){
    this.dmdCreatePaper(container);
    this.dmdCreateModalView(container);
}

DragMultipleDrop.prototype.dmdCreatePaper = function(container){
    container.append('<div id="dmd_sub-container" class="container"></div>');

    $('#dmd_sub-container').append('<div class="dmd_header-answer">' +
            '<input type="text" id="dmd_txtAnswer"/>'+
            '<input class="btn btn-info" type="button" id="dmd_btnAdd" value="Add"/><p id="dmd_smsError"></p>' +
            '</div> <p>Drag the correct order to your question!</p> ' +
            '<div id="dmd_body-answer"><img src="" alt=""/>' +
            '</div> ' +
            '<div class="clear-content"></div> <div class="dmd_footer-answer"> ' +
            '<button id="dmd_btnModalPreview" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">Preview</button>'+
            '<input id="dmd_btnSubmit" class="btn btn-success" type="button" value="Submit"/>' +
            '</div>');
}

DragMultipleDrop.prototype.dmdCreateModalView = function (container) {
    container.append('<div id="dmd_basicModal" class="modal fade bs-example-modal-lg" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog modal-lg">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" id="dmd_closeModal" >Close</button>'+
                    '<h4 class="modal-title" id="dmd_myModalLabel">Preview Test</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '<p id="dmd_pQuestionPreview"></p>'+
                        '<div id="dmd_containerPreview"> ' +
                            '<div class="row">' +
                            '<div id="dmd_droppableContainer" class="col-md-4 c-border"></div>' +
                            '<div class="col-md-8 c-border"><div id="dmd_imageContainer" class="c-border clear-content"></div><div id="dmd_sortableContainer">' +
                            '<div class="clear-content"></div></div></div>' +
                            '</div>'+
                        '</div> ' +
                        '<div id="dmd_msgResult"></div>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" id="dmd_submitAnswer" class="btn btn-primary">Submit Answer</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
    );
}

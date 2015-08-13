$(document).ready(function () {
    var MaxInputs = 20;
    var contenedor = $("#selectableChart_Chart");
    var inputsContainer = $("#selectableChart_inputsContainer");
    var AddButton = $("#agregarCampo");

    var jsonArr = [];
    var jsonArrPreview = [];
    var jsonGlobal = [];

    var x = $("#selectableChart_inputsContainer .added").length + 1;
    var FieldCount = x - 1;
    var r;
    var activo = false;

    // New Column
    $(AddButton).click(function (e) {      
        if (x <= MaxInputs) {
            if ($('#campo_' + FieldCount).val() != null && $('#label_' + FieldCount).val()) {
                FieldCount++;
                var html = '<div class="added">'+
                                '<div class="row">'+
                                    '<div class="col-md-3">'+
                                        '<input type="text" class="form-control" name="mitexto[]" onkeypress="return validateNum(event)"  id="campo_' + FieldCount + '" placeholder="Value" />' +
                                   ' </div>'+
                                    '<div class="col-md-5">'+
                                        '<input type="text" class="form-control" name="miLabel[]" id="label_' + FieldCount + '" placeholder="Label" />' +
                                        '<input type="text" style="display: none" id="hfSelected_' + FieldCount + '" value="' + false + '"/> ' +
                                   '</div>'+
                                    '<div class="col-md-1">'+
                                        '<a href="#" id="' + FieldCount + '" class="glyphicon glyphicon-remove selectableChart_deleteColumnValue"></a>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'
                inputsContainer.append(html);
                x++;
            }
        }
        return false;
    });

    //Remove Column
    $("body").on("click", ".selectableChart_deleteColumnValue", function (e) { //click en eliminar campo
        if (x > 1) {
           $(this).parent().parent().remove(); //eliminar el campox
            x--;
        }

        if (jsonArr.length > 0) {
            jsonArr = [];
            FieldCount--;
        }
        var d = 1;
        $('.added .row').each(function () {
            $(this).find('.form-control').attr('id', 'campo_' + d);
            d = d + 1;
        })
        return false;
    });

    //Render Chart
    $("#selectableChart_showChart").click(showChart);

    function showChart() {
        jsonArr = [];
        for (var i = 1; i <= FieldCount; i++) {
            var des = "campo_" + i;
            var lab = "label_" + i;
            var selected = "hfSelected_" + i; selected = $('#' + selected).val(); selected = selected.match(/true/i) ? true : false;
            jsonArr.push({ id: i, etiqueta: $('#' + lab).val(), valor: parseFloat($('#' + des).val()), option: selected });
        }
        renderChart(jsonArr);
    }

    function renderChart(jsonArr, container) {
        container = container || "#selectableChart_chartContainer";
        var flotData = [];
        var ticks = [];
        for (var i = 1; i <= FieldCount; i++) {
            var des = "campo_" + i;
            var lab = "label_" + i;
            var barColor = jsonArr[i-1].option ? 'red' : 'green';
            flotData.push({ data: [[i-1, parseFloat($('#' + des).val())]], color: barColor });
            ticks.push([i - 1, $('#' + lab).val()]);
        }

        //load Preview
        $.plot(container, flotData, {
            grid: { clickable: true, autoHighlight: false },
            series: {
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center",
                    clickable: true,
                    autoHighlight: false
                }
            },
            xaxis: {
                ticks: ticks
            }
        });

    }

    $("#selectableChart_chartContainer").bind("plotclick", function (event, pos, item) {
        if (item) {
            jsonArr[item.seriesIndex].option = !jsonArr[item.seriesIndex].option;
            var selected = "hfSelected_" + parseInt(item.seriesIndex + 1); $('#' + selected).val(jsonArr[item.seriesIndex].option);
            renderChart(jsonArr);
        }
    });

    $("#selectableChart_previewContainer").bind("plotclick", function (event, pos, item) {
        if (item) {
            jsonArrPreview[item.seriesIndex].option = !jsonArrPreview[item.seriesIndex].option;
            renderChart(jsonArrPreview, "#selectableChart_previewContainer");
        }
    });

    $("#btnSelectableChart_Preview").click(function () {
        jsonArrPreview = JSON.parse(JSON.stringify(jsonArr));
        for (var i = 0; i < jsonArrPreview.length; i++) {
            jsonArrPreview[i].option = false;
        }

        var editor = hfQBody.value;

        $('#selectableChart_questionContainer').html(editor);
        $("#selectableChart_result").html('');

        renderChart(jsonArrPreview, "#selectableChart_previewContainer");
    });

    $("#selectableChart_closeModal").on('click', function () {
        $('#selectableChart_Preview').modal('hide');
    });

    $("#selectableChart_submitAnswer").click(function () {
        var result = true;
        for (var i = 0; i < jsonArrPreview.length; i++) {
            if (jsonArrPreview[i].option !== jsonArr[i].option) {
                result = false;
                break;
            }
        }

        if (result)
            $('#selectableChart_result').html('<img src="../Content/images/win.png" width="50" height="50"/>')
        else
            $('#selectableChart_result').html('<img src="../Content/images/lose.png" width="50" height="50"/>')
    });

    $("#bntSelectableCharts_Save").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 30,
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#selectableChart_Notes").val(),
            statusId: 1,
            approveUser: null,
            worth: $("#Worth3").val(),
            chartColumns: jsonArr
        };

        $.post(
            "/onlinedw/home/SelectableChart_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',30', '*');
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


    //run - check if we're editing
    if (typeof globalSettings !== 'undefined') {
        if (typeof globalPageType !== 'undefined' && globalPageType !== "View") {
            //EDIT mode (edit page)
            $("#selectableChart_inputsContainer").html("");
            jsonArr = [];
            FieldCount = 0;
            for (var i = 0; i < globalSettings.columns.length; i++) {
                FieldCount++;
                var html = '<div class="added">' +
                                '<div class="row">' +
                                    '<div class="col-md-3">' +
                                        '<input type="text" class="form-control" name="mitexto[]" id="campo_' + FieldCount + '" placeholder="Value" value="' + globalSettings.columns[i].value + '"/>' +
                                    ' </div>' +
                                    '<div class="col-md-5">' +
                                        '<input type="text" class="form-control" name="miLabel[]" id="label_' + FieldCount + '" placeholder="Label" value="' + globalSettings.columns[i].label + '"/>' +
                                        '<input type="text" style="display: none" id="hfSelected_' + FieldCount + '" value="' + globalSettings.columns[i].selected + '"/> ' +
                                    '</div>' +
                                    '<div class="col-md-1">' +
                                        '<a href="#" id="' + FieldCount + '" class="glyphicon glyphicon-remove selectableChart_deleteColumnValue"></a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                inputsContainer.append(html);
                x++;
            }
            showChart();
        }
        else {
            //VIEW mode (view page)
            $("#selectableChart_inputsContainer").html("");
            jsonArr = [];
            FieldCount = 0;
            for (var i = 0; i < globalSettings.columns.length; i++) {
                FieldCount++;
                var html = '<div class="added">' +
                                '<div class="row">' +
                                    '<div class="col-md-3">' +
                                        '<input type="text" class="form-control" readonly="true" name="mitexto[]" id="campo_' + FieldCount + '" placeholder="Value" value="' + globalSettings.columns[i].value + '"/>' +
                                    ' </div>' +
                                    '<div class="col-md-5">' +
                                        '<input type="text" class="form-control" readonly="true" name="miLabel[]" id="label_' + FieldCount + '" placeholder="Label" value="' + globalSettings.columns[i].label + '"/>' +
                                        '<input type="text" style="display: none" id="hfSelected_' + FieldCount + '" value="' + globalSettings.columns[i].selected + '"/> ' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                inputsContainer.append(html);
                x++;
            }
            showChart();
        }
    }

});

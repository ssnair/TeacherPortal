$(function () {

    // setup tooltip functionality
    $(document).tooltip({
        track: false,
        show: {
            effect: "blind",
            delay: 125
        },
        hide: {
            effect: "blind",
            delay: 125
        }
    });

    // setup CKEditor popup functionality
    var html = 'Hello', editorElem, hfEditorElem, emptyEditorText = '<span>Click to edit...</span>';
    odwEditor = null;  // global var

    function createEditor(elem) {
        if (odwEditor)
            return;
        $("#odwDialog").bind('dialogopen', function () //JQ
        {
            odwEditor = CKEDITOR.replace('odwEditor', {
                filebrowserUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files',
                filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
                filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
                filebrowserVideoBrowseUrl: '/ckfinder/ckfinder.html?type=Video',
                filebrowserFlashBrowseUrl: '/ckfinder/ckfinder.html?type=Flash',
                filebrowserImageUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images',
                filebrowserVideoUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Video',
                filebrowserFlashUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash',
                on:
                    {
                        'instanceReady': function (ev) {
                            //Set the focus to your editor, if it has data, set it to the end of the data.
                            CKEDITOR.instances.odwEditor.focus();

                            //ev.editor.focus();

                            //var s = ev.editor.getSelection(); // getting selection
                            //var selected_ranges = s.getRanges(); // getting ranges
                            //var node = selected_ranges[0].startContainer; // selecting the starting node
                            //var parents = node.getParents(true);

                            //node = parents[parents.length - 2].getFirst();

                            //while (true) {
                            //    var x = node.getNext();
                            //    if (x == null) {
                            //        break;
                            //    }
                            //    node = x;
                            //}

                            //s.selectElement(node);
                            //selected_ranges = s.getRanges();
                            //selected_ranges[0].collapse(false);  //  false collapses the range to the end of the selected node, true before the node.
                            //s.selectRanges(selected_ranges);  // putting the current selection there
                        }
                    },
            });
            if ($(editorElem).html().indexOf('Click to edit...') > -1) {
                odwEditor.setData('');
            }
            else {
                //odwEditor.setData($(editorElem).html());
                odwEditor.setData($("#" + editorElem.id).next("input").attr("value"));
            }

        })
        .bind('dialogclose', function () {

            removeEditor();//CK
            $(this).dialog('destroy');
        })
        .dialog({
            autoOpen: false,
            height: 400, // 0.90 * $(window).height(),
            maxHeight: 0.80 * $(window).height(),//1  0.95
            width: 800,
            maxWidth: 800,
            modal: true,
            resizable: false,
            autoResize: true,
            position: { my: "left top", at: "left+5% top-10%", of: window },

            buttons: {
                Ok: function () {
                    if (odwEditor.getData() == '') {
                        $(editorElem).html('<span>Click to edit...</span>');
                        $(editorElem).next().val('<span>Click to edit...</span>');
                    }
                    else {
                        $(editorElem).html(odwEditor.getData());
                        reloadMathJax(odwEditor.id);
                        $(editorElem).next().val(odwEditor.getData());
                    }
                    removeEditor();//CK
                    $(this).dialog('destroy');
                },
                Cancel: function () {
                    removeEditor();//CK
                    $(this).dialog('destroy');
                }
            }

        }).dialog('open').center;
        // set focus to the input box on the Editor
        //$("iframe[name='ifTech']").contents().find("iframe").contents().find(".cke_editable").focus()
        //odwEditor.focus();
        //var selection = odwEditor.getSelection();
        //var range = selection.getRanges()[0];
        //var pCon = range.startContainer.getAscendant({ p: 2 }, true); //getAscendant('p',true);
        //var newRange = new CKEDITOR.dom.range(range.document);
        //newRange.moveToPosition(pCon, CKEDITOR.POSITION_BEFORE_START);
        //newRange.select();
    }

    function removeEditor() {
        if (!odwEditor)
            return;
        // Destroy the odwEditor.
        odwEditor.destroy();
        odwEditor = null;
    }

    function setupEditor() {

        $('.qEditor').click(function () {
            debugger;
            editorElem = this;
            createEditor(this);
        });

    }

    setupEditor();

}); // end of $(function ()



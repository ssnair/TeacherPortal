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
    var editorElem;
    odwEditor = null;  // global var

    function createEditor(elem) {
        if (odwEditor)
            return;
        $("#odwDialog").bind('dialogopen', function () //JQ
        {
            odwEditor = CKEDITOR.replace('odwEditor', {
                extraPlugins: 'droptarget,flash,video,audio,eqneditor,mathjax,smiley,iframe',
                toolbar: "full",
                toolbar_full: [
                    { name: "document", items: ["Source", "Save", "NewPage", "Preview", "Print", "-", "Templates"] },
                    { name: 'clipboard', items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"] },
                    { name: "editing", items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"] },
                    "/",
                    { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
                    { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote", "CreateDiv", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock", "-", "BidiLtr", "BidiRtl"] },
                    "/",
                    { name: "insertmedia", items: ["Image", "Flash", "Video", "Audio", "EqnEditor", "Mathjax"] },
                    { name: "insert", items: ["Table", "HorizontalRule", "Smiley", "SpecialChar", "PageBreak", "Iframe"] },
                    { name: "forms", items: ["Form", "Checkbox", "Radio", "TextField", "Textarea", "Select", "Button", "HiddenField"] },
                    { name: "links", items: ["Link", "Unlink", "Anchor"] },
                    "/",
                    { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
                    { name: "colors", items: ["TextColor", "BGColor"] },
                    { name: "tools", items: ["Maximize", "ShowBlocks"] }
                ],
                filebrowserUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files',
                filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
                filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
                filebrowserVideoBrowseUrl: '/ckfinder/ckfinder.html?type=Video',
                filebrowserFlashBrowseUrl: '/ckfinder/ckfinder.html?type=Flash',
                filebrowserImageUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images',
                filebrowserVideoUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Video',
                filebrowserFlashUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash',
                on: {
                    'instanceReady': function (ev) {
                        CKEDITOR.instances.odwEditor.focus();
                    }
                }
            });
            if ($(editorElem).html().indexOf('Click to edit...') > -1) {
                odwEditor.setData('');
            }
            else {
                //odwEditor.setData($(editorElem).html());
                console.log($("#" + editorElem.id).next("input").attr("value"));
                odwEditor.setData($("#" + editorElem.id).next("input").attr("value"));
            }

        })
        .bind('dialogclose', function () {

            removeEditor();//CK
            $(this).dialog('destroy');
        })
        .dialog({
            autoOpen: false,
            height: 400,
            maxHeight: 0.80 * $(window).height(),
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
            editorElem = this;
            createEditor(this);
        });
    }

    setupEditor();

}); // end of $(function ()



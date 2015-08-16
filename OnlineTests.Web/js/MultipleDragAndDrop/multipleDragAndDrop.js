MultipleDragAndDrop = function (container, settings, scope) {
    var _self = this;
    this.container = container;
    this.settings = settings;
    this.scope = scope;
    this.viewMode = 'teacher';
    this.editor = null;
    this.selectedTarget = null;

    this.redraw = function (settings) {
        _self.buildCKEditor(settings);
        _self.drawContent(settings, CKEDITOR.instances.questionContent);
    }

    this.refresh = function () {
        var options = document.getElementsByClassName('draggable-option');
        for (var i = 0; i < options.length; i++) {
            if ($(options[i]).attr('data-attached-event') == 'false') {
                options[i].addEventListener('dragstart', function drag(evt) {
                    evt.dataTransfer.setDragImage(evt.target, 0, 0);
                    evt.dataTransfer.setData('value', $(this).attr('data-value'));
                    evt.dataTransfer.setData('id', $(this).attr('id'));
                });
                $(options[i]).attr('data-attached-event', 'true');
            }
        }
    }

    this.setViewMode = function (settings, viewMode) {
        if (viewMode == 'teacher') {
            $('#' + CKEDITOR.instances.questionContent.id + '_top').show();
            $('#' + CKEDITOR.instances.questionContent.id + '_bottom').show();
            _self.restoreDropTargets(settings);
            _self.editor.setReadOnly(false);
        } else {
            $('#' + CKEDITOR.instances.questionContent.id + '_top').hide();
            $('#' + CKEDITOR.instances.questionContent.id + '_bottom').hide();
            _self.cleanDropTargets(settings);
            _self.updateDropTargets(settings);
            _self.editor.setReadOnly(true);
        }
        _self.viewMode = viewMode;
    }

    this.submitAnswerFromPreview = function (settings) {
        var targets = settings.targets,
            gotWorth = 0,
            correctValues = 0;

        for (var i = 0; i < targets.length; i++) {
            if (targets[i].teacherValue == targets[i].studentValue) {
                correctValues++;
                gotWorth += Number(targets[i].worth);
            }
        }

        if (settings.strictPunctuation) {
            correctValues = correctValues == targets.length ? correctValues : 0;
            gotWorth = correctValues == targets.length ? gotWorth : 0;
        }

        var message = 'Correct Values: ' + correctValues + ' / ' + targets.length + '\n';
        message += 'Worth: ' + gotWorth + '\n';
        alert(message);
    }

    this.drawContent = function (settings, editorInstance) {
        editorInstance.setData(settings.contents);
    }

    this.drawTargets = function (settings, editorInstance) {
        for (var i = 0; i < settings.targets.length; i++) {
            var target = settings.targets[i];
            var dropTarget = editorInstance.document.getById(target.uuid);
            if (dropTarget != null && dropTarget != undefined) {
                if (target.teacherValue !== '') {
                    dropTarget.$.innerHTML = '<span>' + target.teacherValue + '</span>';
                }
            }
        }
    }

    this.addOption = function (settings, option) {
        if (_self.validateOption(settings, option)) {
            settings.options.push({
                uuid: Helpers.getUUID(),
                value: option.value,
                oldValue: option.value,
                order: settings.options.length + 1
            });
            option.value = '';
        }
    }

    this.updateValue = function (settings, option) {
        if (_self.validateOption(settings, option)) {
            option.oldValue = option.value;
        } else {
            option.value = option.oldValue;
        }
    }

    this.removeOption = function (settings, option) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                for (i = 0; i < settings.options.length; i++) {
                    if (settings.options[i].uuid == option.uuid) {
                        settings.options.splice(i, 1);
                    }
                }
                _self.scope.$apply();
            }
        });
    }

    this.validateOption = function (settings, option) {
        if (option == undefined)
            return false;

        if (option.value == undefined)
            return false;

        if (option.value.length == 0)
            return false;

        var options = settings.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].uuid != option.uuid && options[i].value.toLowerCase() == option.value.toLowerCase()) {
                return false;
            }
        }

        return true;
    }

    this.buildCKEditor = function (settings) {
        _self.editor = CKEDITOR.replace('questionContent', {
            extraPlugins: 'droptarget,flash,video,audio,eqneditor,mathjax,smiley,iframe',
            
            toolbar: "full",
            toolbar_full: [
                { name: "document", items: ["Droptarget", "Save", "NewPage", "Preview", "Print", "-", "Templates"] },
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

            /*toolbar: [
                { name: 'actions', items: ['Droptarget'] },
                { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'] },
                { name: 'behaviors', items: ['Undo', 'Redo'] },
                { name: 'zoom', items: ['Maximize'] },
                '/',
                { name: 'inserts', items: ['Image', 'Mathjax', 'Table', 'SpecialChar', 'PageBreak'] },
                { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                { name: 'alignments', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                { name: 'indent', items: ['NumberedList', 'BulletedList'] },
                { name: 'paragraph', items: ['Outdent', 'Indent', 'HorizontalRule', 'Blockquote'] },
                '/',
                { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                { name: 'fontStyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'styleTools', items: ['Subscript', 'Superscript', 'RemoveFormat'] }
            ],*/
            enterMode: CKEDITOR.ENTER_BR,
            shiftEnterMode: CKEDITOR.ENTER_P
        });

        _self.editor.config.width = settings.container.width;
        _self.editor.config.height = settings.container.height;
        _self.editor.config.allowedContent = true;        
        //CKEDITOR.dtd.$editable.label = 1;
        _self.onEditorChange(settings, CKEDITOR.instances.questionContent);
        _self.onEditorSetData(settings, CKEDITOR.instances.questionContent);
        _self.onEditorReady(settings, CKEDITOR.instances.questionContent);
        _self.onShowDialog(settings, CKEDITOR.instances.questionContent);
    }

    this.cleanDropTargets = function (settings) {
        var dropTargets = CKEDITOR.instances.questionContent.document.find('.droptarget');
        for (var i = 0; i < dropTargets.count() ; i++) {
            var dropTarget = dropTargets.getItem(i);
            var target = _self.getElementByUUID(settings.targets, dropTarget.$.id);
            target.studentValue = null;
            dropTarget.$.innerHTML = "";
        }
    }

    this.restoreDropTargets = function (settings) {
        var dropTargets = CKEDITOR.instances.questionContent.document.find('.droptarget');
        for (var i = 0; i < dropTargets.count() ; i++) {
            var dropTarget = dropTargets.getItem(i);
            var target = _self.getElementByUUID(settings.targets, dropTarget.$.id);

            var span = document.createElement("SPAN");
            var text = document.createTextNode(target.teacherValue == null ? '' : target.teacherValue);
            span.appendChild(text);
            dropTarget.$.innerHTML = "";
            dropTarget.$.appendChild(span);
        }
    }

    this.updateDropTargets = function (settings) {
        for (var i = 0; i < settings.targets.length; i++) {
            var target = settings.targets[i];
            var dropTarget = CKEDITOR.instances.questionContent.document.getById(target.uuid);
            if (dropTarget == null || dropTarget == undefined) {
                settings.targets.splice(i, 1);
            }
        }
    }

    this.getElementByUUID = function (list, uuid) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].uuid == uuid)
                return list[i];
        }
        return null;
    }

    this.onEditorChange = function (settings, editorInstance) {
        editorInstance.on('change', function () {
            settings.contents = CKEDITOR.instances.questionContent.document.getBody().getHtml();
        });
    }

    this.onEditorSetData = function (settings, editorInstance) {
        editorInstance.on('contentDom', function (event) {
            _self.onSelectWidget(settings, event);
        });
    }

    this.onEditorReady = function (settings, editorInstance) {
        editorInstance.on('instanceReady', function (event) {
            $('.cke_button__droptarget').click(function (e) {
                _self.selectedTarget = null;
            });
            _self.onDropOption(settings, event);
            _self.onSelectWidget(settings, event);
            _self.drawTargets(settings, editorInstance);
        });
    }

    this.onShowDialog = function (settings, editorInstance) {
        editorInstance.on('dialogShow', function (event) {
            event.data.definition.dialog.on('ok', function (e) {
                if (e.sender._.name === 'droptarget') {
                    var worth = e.sender._.contents.info.worth.getValue();
                    if (_self.selectedTarget) {
                        var target = _self.getElementByUUID(settings.targets, _self.selectedTarget.uuid);
                        target.worth = Number(worth);
                    } else {
                        var target = {
                            uuid: Helpers.getUUID(),
                            teacherValue: null,
                            studentValue: null,
                            worth: worth
                        };
                        settings.targets.push(target);
                        _self.selectedTarget = target;
                    }
                }
            });
        });
    }

    this.onDropOption = function (settings, event) {
        event.editor.document.on('drop', function (evt) {
            var droptargetContent = $(evt.data.$.target.outerHTML);
            if (droptargetContent.hasClass('droptarget')) {
                var dataTransfer = evt.data.$.dataTransfer;
                var target = _self.getElementByUUID(settings.targets, evt.data.$.target.id);
                if (_self.viewMode == 'teacher') {
                    target.teacherValue = dataTransfer.getData('value');
                } else {
                    target.studentValue = dataTransfer.getData('value');
                }

                evt.data.$.target.innerHTML = "";
                var span = document.createElement("SPAN");
                var text = document.createTextNode(dataTransfer.getData('value'));
                span.appendChild(text);
                evt.data.$.target.appendChild(span);
                evt.data.preventDefault(true);
            }
        });
    }

    this.onSelectWidget = function (settings, event) {
        event.editor.widgets.on('instanceCreated', function (evt) {
            if (evt.data.name === 'droptarget') {
                evt.data.on('focus', function (e) {
                    if (_self.selectedTarget) {
                        e.sender.element.$.id = _self.selectedTarget.uuid;
                    } else {
                        var uuid = e.sender.element.$.id;
                        var target = _self.getElementByUUID(settings.targets, uuid);
                        _self.selectedTarget = target;
                    }
                });
                evt.data.on('blur', function (e) {
                    _self.selectedTarget = null;
                });
            }
        });
    }

    this.exportJson = function (settings) {
        var exportedSettings = {
            container: settings.container,
            strictPunctuation: settings.strictPunctuation,
            contents: settings.contents,
            options: [],
            targets: []
        };

        for (var i = 0; i < settings.options.length; i++) {
            exportedSettings.options.push({
                uuid: settings.options[i].uuid,
                value: settings.options[i].value,
                oldValue: settings.options[i].oldValue,
                order: settings.options[i].order,
                worth: 0
            });
        }

        for (var i = 0; i < settings.targets.length; i++) {
            exportedSettings.targets.push({
                uuid: settings.targets[i].uuid,
                teacherValue: settings.targets[i].teacherValue || '',
                worth: settings.targets[i].worth
            });
        }

        var result = {
            id: settings.id,
            //questionId: scope.questionId,
            questionType: 'MultipleDragAndDrop2',
            questionText: scope.questionText,
            questionNotes: scope.questionNotes,
            multipleDragAndDrop: JSON.stringify(exportedSettings)
        };
        return result;
    }

}
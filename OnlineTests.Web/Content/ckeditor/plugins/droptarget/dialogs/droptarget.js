CKEDITOR.dialog.add('droptarget', function (editor) {
    return {        
        title: 'Drop Target',
        width: 200,
        minWidth: 200,
        minHeight: 100,        
        resizable: false,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        id: 'attributes',
                        type: 'html',
                        html: 'Configure drop target attributes.'
                    },
                    {
                        id: 'worth',
                        type: 'text',
                        label: 'Worth',
                        width: '190px',
                        'default': '0',
                        validate: CKEDITOR.dialog.validate.number('Invalid value to Worth'),                        
                        setup: function (widget) {
                            if (widget.data.worth == undefined) {
                                this.setValue(this.default);
                            } else {
                                this.setValue(widget.data.worth);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('worth', this.getValue());
                        }
                    },
                    {
                        id: 'description',
                        type: 'html',
                        html: 'Configure drop target editor properties.'
                    }, 
                    {
                        id: 'width',
                        type: 'text',
                        label: 'Width',
                        width: '190px',
                        'default': '50px',
                        validate: CKEDITOR.dialog.validate.notEmpty('This Width cannot be empty.'),
                        setup: function (widget) {
                            if (widget.data.width == undefined) {
                                this.setValue(this.default);
                            } else {
                                this.setValue(widget.data.width);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('width', this.getValue());
                        }
                    },
                    {
                        id: 'height',
                        type: 'text',
                        label: 'Height',
                        width: '190px',
                        'default': '15px',
                        validate: CKEDITOR.dialog.validate.notEmpty('This Height cannot be empty.'),
                        setup: function (widget) {
                            if (widget.data.height == undefined) {
                                this.setValue(this.default);
                            } else {
                                this.setValue(widget.data.height);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('height', this.getValue());
                        }
                    },
                    {
                        id: 'border',
                        type: 'select',
                        label: 'Border',
                        style: 'width: 190px',
                        items: [
                            ['Show', 'show'],
                            ['Hide', 'hide']
                        ],
                        'default': 'show',
                        setup: function (widget) {
                            if (widget.data.border == undefined) {
                                this.setValue(this.default);
                            } else {
                                this.setValue(widget.data.border);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('border', this.getValue());
                        }
                    },
                    {
                        id: 'footer',
                        type: 'html',
                        html: ' '
                    },
                ]
            }
        ]
    };
});

CKEDITOR.plugins.add('droptarget', {
    requires: 'widget',
    icons: 'droptarget',
    init: function (editor) {
        CKEDITOR.dialog.add('droptarget', this.path + 'dialogs/droptarget.js');
        editor.widgets.add('droptarget', {
            button: 'Drop Target',
            //inline: true,            
            template: '<div class="droptarget"></div>',
            editables: {
                content: {
                    selector: '.droptarget',
                    allowedContent: ''
                }
            },
            allowedContent: 'div(!droptarget,border-show,border-hide){width,height}',
            requiredContent: 'div(droptarget)',
            upcast: function (element) {
                return element.name == 'div' && element.hasClass('droptarget');
            },            
            dialog: 'droptarget',
            init: function () {                  
                var width = this.element.getStyle('width');
                if (width)
                    this.setData('width', width);
                var height = this.element.getStyle('height');
                if (height)
                    this.setData('height', height);
                if (this.element.hasClass('border-show'))
                    this.setData('border', 'show')
                if (this.element.hasClass('border-hide'))
                    this.setData('border', 'hide')
            },
            data: function () {
                if (this.data.width == '')
                    this.element.removeStyle('width');
                else
                    this.element.setStyle('width', this.data.width);

                if (this.data.height == '')
                    this.element.removeStyle('height');
                else
                    this.element.setStyle('height', this.data.height);

                this.element.removeClass('border-show');
                this.element.removeClass('border-hide');
                if (this.data.border)
                    this.element.addClass('border-' + this.data.border);
            }
        });
    }
});
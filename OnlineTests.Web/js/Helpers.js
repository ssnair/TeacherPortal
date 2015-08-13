Helpers = function () {
    return {
        getUUID: function () {
            function fd() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return fd() + fd() + '-' + fd() + '-' + fd() + '-' + fd() + '-' + fd() + fd() + fd();
        },

        clearContainer: function (container) {
            if (container != null) {
                if (container.firstChild != undefined) {
                    container.removeChild(container.firstChild);
                }
            }
            return container;
        },

        getLineStyle: function (type) {
            var strokeDasharray = ['', '--', '. '];
            var stroke = '';
            switch (type) {
                case 'solid':
                    stroke = strokeDasharray[0];
                    break;
                case 'dashed':
                    stroke = strokeDasharray[1];
                    break;
                case 'dotted':
                    stroke = strokeDasharray[2];
                    break;
                default: stroke = strokeDasharray[0];
            }
            return stroke;
        },

        text: function (canvas, x, y, message, attributes, transform) {
            attributes = attributes == undefined ? {} : attributes;
            var raphaelText = canvas.text(x, y, message).attr(attributes);
            if (transform != undefined) raphaelText.transform(transform);
            $('tspan', raphaelText.node).attr('dy', 0);
            return raphaelText;
        },

        wrapText: function (text, label, width) {
            var maxWidth = width + 5,
                words = label.split(" ");

            var tempText = "";
            for (var i = 0; i < words.length; i++) {
                text.attr("text", tempText + " " + words[i]);
                if (text.getBBox().width > maxWidth) {
                    tempText += "\n" + words[i];
                } else {
                    tempText += " " + words[i];
                }
            }

            text.attr("text", tempText.substring(1));
            //$('tspan', text.node).attr('dy', 0);
            return text;
        },

        validateMinValue: function (value, defaultValue) {
            return value == 0 ? defaultValue : value;
        }
    }
}();
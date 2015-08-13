onlineTestsApp.service("multipleDragAndDropSrvc", function () {
    return {
        buildQuestion: function(loadedData) {
            var question = this.getEmptyQuestion();
            return question;
        },
        getEmptyQuestion: function () {
            return {
                viewMode: 'teacher',
                chartType: { id: 'multiple-drag-and-drop' },
                container: { width: '100%', height: 250 },
                strictPunctuation: false,
                contents: '',
                options: [],
                targets: []
            };
        },
        completeSettings: function (settings) {
        }
    }
});
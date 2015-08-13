// QuestionsContainer/services.js

'use strict';

onlineTestsApp.service("QuestionsContainerSrvc", function () {
    return {getQuestions: function () {
        return [{
            questionType: 'draw-lines-in-a-chart'
        },
        {
            questionType: 'multiple-drag-and-drop'
        }];
    }};
});
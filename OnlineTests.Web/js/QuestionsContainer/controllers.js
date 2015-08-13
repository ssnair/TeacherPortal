// questionsContainer/controllers.js"

onlineTestsApp.controller("QuestionsContainerCtrl", ['$scope', 'QuestionsContainerSrvc', function ($scope, QuestionsContainerSrvc) {
    $scope.questionType = "BaseQuestion";
    $scope.title = "container";
    $scope.htmlContent = "<h2>HtmlContets</h2>";
    $scope.questions = QuestionsContainerSrvc.getQuestions();
    $scope.count = 0;

    $scope.render = function (question) {
        console.log("the renderer");
        return $sce.trustAsHtml(question.draw());
    };

    $scope.addQuestion = function (question) {
        var message = "unknonw question";
        switch (question) {
            case 'draw-lines-in-a-chart':
                message = 'draw awesomes lines in a chart';
                break;
        }
        alert("add question " + message);
        //$scope.questions.push(question);
        //question.show();
    };
}]);
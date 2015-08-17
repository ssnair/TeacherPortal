//  question/controllers.js
onlineTestsApp.controller("QuestionCtrl", ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    $scope.title = "question";
    $scope.questionText = ""; // "How many numbers are there?";
    $scope.questionNotes = ""; // "Hey there.. these are my notes";
    $scope.viewMode = "teacher";
    $scope.toggleViewMode = function () {
        $scope.$broadcast("viewModeChanged", $scope.viewMode);
        if ($scope.viewMode == "student")
            $("#questionNotes").attr("disabled", "disabled")
            .css('background-color', '#fff').css('border', '0px');
        else
            $("#questionNotes").removeAttr("disabled");
    }

    $scope.submitAnswer = function () {
        $scope.$broadcast("submitAnswerFromPreview");
    }

    $scope.saveQuestion = function () {
        $scope.questionText = $("#hfQBody").val();
        $scope.$broadcast("save");
    }

    $scope.$on('initParent', function (event, settings) {
        $scope.questionText = settings.QuestionText;
        $scope.questionNotes = settings.Notes;
    });

    //$scope.init = function () {
    //    var questionId = 0;
    //    var urlEdit = "/edit/";
    //    var urlPath = $location.$$absUrl.toLowerCase()
    //    var editPosition = urlPath.indexOf(urlEdit);

    //    if (editPosition != -1) {
    //        // EDIT mode, let's get the question info
    //        questionId = parseInt(urlPath.substring(editPosition + urlEdit.length));

    //        var backendSettings = $('#vmSettings').val();
    //        if (backendSettings != "") {
    //            var parsedSettings = JSON.parse(backendSettings);
    //            $scope.questionText = parsedSettings.QuestionText;
    //            $scope.questionNotes = parsedSettings.Notes;
    //        }
    //    }

    //    $scope.questionId = questionId;
    //    $scope.$broadcast("init", { id: questionId });
    //}

    //$timeout(function () {
    //    $scope.init();
    //}, 200);
}]);
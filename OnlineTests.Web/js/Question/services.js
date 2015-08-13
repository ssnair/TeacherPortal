onlineTestsApp.service('questionSrvc', ['$http', 'interactiveChartSrvc', 'divideAndSelectShapeSrvc', function ($http, interactiveChartSrvc, divideAndSelectShapeSrvc) {
    this.getSettings = function (scope, id) {
        if (typeof id === 'undefined' || id === null) {
            switch (scope.questionType) {
                case 'interacive-chart':
                    return interactiveChartSrvc.getEmptyQuestion();
                case 'divide-and-select-shape':
                    return divideAndSelectShapeSrvc.getEmptyQuestion();
                default:
            }
        } else {

        }
    }

    this.save = function (settings) {
        $http.post('/OnlineDW/home/saveQuestion', { 'settings': JSON.stringify(settings) })
        .success(function (data, status, headers, config) {
            // TODO-IL: comment console.info statements
            console.info('success', data);
            //window.parent.postMessage(data.data + ',32', '*');
            window.parent.postMessage(data.data + ',' + data.type + '', '*');
        })
        .error(function (data, status, headers, config) {
            // TODO-IL: comment console.info statements
            console.info('error', data);
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DANGER,
                title: 'Information',
                message: 'An error has occured trying to save your Question<br>Please try again!',
                buttons: [{
                    label: 'Ok',
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }]
            });
        });
    }
}]);

onlineTestsApp.factory('questionAsyncSrvc', ['$http', 'questionSrvc', 'interactiveChartSrvc', function ($http, questionSrvc, interactiveChartSrvc) {
    var questionAsyncService = {
        load: function (id) {
            var promise = $http.get('/OnlineDW/home/loadQuestion/' + id)
            // TODO-IL: See if this works...otherwise move to above statement
            //var promise = $http.get('/OnlineDW/home/View/' + id)
                .then(function (response) {
                    var question = interactiveChartSrvc.buildQuestion(response.data);
                    return question;
                });
            return promise;
        }
    };

    return questionAsyncService;
}]);

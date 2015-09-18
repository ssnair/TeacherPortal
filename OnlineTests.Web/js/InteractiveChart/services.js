onlineTestsApp.service("interactiveChartSrvc", function () {
    return {
        buildQuestion: function (loadedData) {
            var question = this.getEmptyQuestion();
            question.chartType = loadedData.Settings.chartType;
            question.container = loadedData.Settings.container;
            question.grid = loadedData.Settings.grid;
            if (question.chartType.id === 'line-chart') {
                question.lineChart = loadedData.Settings.lineChart;
                this.completeLineChart(question.lineChart);
            }
            //question.questionId = loadedData.questionId;
            //question.questionText = loadedData.questionText;
            //question.questionNotes = loadedData.questionNotes;
            return question;
        },
        getEmptyQuestion: function () {
            return {
                //questionId: 0,
                //questionText: "",
                //questionNotes: "",
                chartType: { id: 'none' },
                container: { width: 500, height: 300 },
                grid: { width: 10, height: 10 },
                lineChart: this.getEmptyLineChart(),
                barChart: this.getEmptyBarChart(),
                scatterPlot: this.getEmptyScatterPlot(),
                pieChart: this.getEmptyPieChart(),
                histogram: this.getEmptyHistogram(),
                pictogram: this.getEmptyPictogram(),
                stemLeafPlot: this.getEmptyStemLeafPlot(),
                frequencyPolygonChart: this.getEmptyFrequencyPolygonChart()
            }
        },
        getEmptyLineChart: function () {
            return {
                yAxisMin: 0,
                yAxisMax: 100,
                yAxisScale: 10,
                yIncrement: 10,
                title: 'Title',
                xAxisTitle: 'X Label',
                yAxisTitle: 'Y Label',
                strictPunctuation: false,
                gridLineStyle: { id: 'solid', name: 'Solid' },
                connectorLineStyle: { id: 'solid', name: 'Solid' },
                plotAreaPadding: { top: 45, left: 45, right: 25, bottom: 45 },
                points: [],
                connectors: [],
                teacherPoints: [],
                teacherConnectors: []
            }
        },
        getEmptyBarChart: function () {
            return {
                yAxisMin: 0,
                yAxisMax: 100,
                yAxisScale: 10,
                yIncrement: 10,
                title: 'Title',
                xAxisTitle: 'X Label',
                yAxisTitle: 'Y Label',
                strictPunctuation: false,
                gridLineStyle: { id: 'solid', name: 'Solid' },
                plotAreaPadding: { top: 45, left: 45, right: 15, bottom: 45 },
                bars: [],
                teacherBars: []
            }
        },
        getEmptyScatterPlot: function () {
            return {
                yAxisMin: 0,
                yAxisMax: 100,
                yAxisScale: 10,
                yIncrement: 10,
                title: 'Title',
                xAxisTitle: 'X Label',
                yAxisTitle: 'Y Label',
                strictPunctuation: false,
                gridLineStyle: { id: 'solid', name: 'Solid' },
                plotAreaPadding: { top: 45, left: 45, right: 25, bottom: 45 },
                points: [],
                connectors: [],
                teacherPoints: [],
                teacherConnectors: []
            }
        },
        getEmptyPieChart: function () {
            return {
                title: 'Title',
                totalArea: 100,
                scale: 10,
                labelOutsideLocation: true,
                strictPunctuation: false,
                plotAreaPadding: { top: 30, left: 20, right: 10, bottom: 20 },
                slices: [],
                teacherSlices: []
            }
        },
        getEmptyHistogram: function () {
            return {
                plotAreaPadding: { top: 45, left: 45, right: 25, bottom: 35 },
                title: 'Title',
                xAxisTitle: 'X Label',
                yAxisTitle: 'Y Label',
                gridLineStyle: { id: 'solid', name: 'Solid' },
                strictPunctuation: false,
                xAxisMin: 0,
                xAxisMax: 100,
                xInterval: 10,
                yAxisMin: 0,
                yAxisMax: 7,
                yAxisScale: 1,
                yInterval: 1,
                intervals: [],
                teacherIntervals: []
            }
        },
        getEmptyPictogram: function () {
            return {
                plotAreaPadding: { top: 25, left: 15, right: 10, bottom: 20 },
                title: 'Title',
                seriesValue: 10,
                symbolValue: 2,
                symbolWidth: 35,
                symbolHeight: 35,
                symbolSize: 0,
                symbol: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADVElEQVR4Xu2Z/4dUURTA73kzUc1O/Qv93A+RRCKtZHYqMiSRqEjKiP6FfotIZJS1bJFIIlHtjmRHVGRF0s/9C9s3fZn2do457XnezJt7z7vvvbXs4bhvlznn83n3vu9grTVrOaISANYF1gWuAGy8CtAsC4p6Uc9AAYHfZMxjNH12DeBi0fDUo4K9atjTRyJywdcG8FOYgNm5XqAE1aYemADYc8JDIhoHXxd4wwnAEkXAA8PH+k3VHRJyHUjAb0V4g/ApABazfdnaW3nA32B44knhnEee1hlrfzoF7iD8V4S3DJ8WwBKXAiVu0myOhReJ+giJahLshzGTCNdwVYNBw04HwLQzSnRozQu8KxrEhuOccwlRYfAvbBGifUEpcRvhraIHxHo4BKSBUUqc95SYVsNLbR8BaaSQAJSwHhLTqtl113Tejc4oZwKzfS5FYkYPL7X0AhKzGab8bEJiVr0jpEaIgAAoph4Y4DQD3FXDy29zE2AQLwmIzQRtaGfvlMBrBdxxT7k3iVoDf5LhVQLauK86O3mFtQr4AAGJB54HNniu+RMMX4KAxEOHhFOI4Y8zfMkCIgEKCUjAHxP4sgUkHikk4meoVgi83I2GRyUQYlVn4InjjOQ6eI+u5hJ66jiIfa/YR1Ci9CX0nNc9CHxGB9PBWuZQRolqqfDhEuFLqKu/MTOah6KDRd5KvNDDt2lD9VDEErkLvMwAfwBBQn6bm0AvwwPNfgYIrREs0NM+BjJ8WC05xe4LeaR8pYWXhrnXVAu85ikHxbrd64CX2nxMKGt7C7xNWa8wBn6PH7z0UElID6fAG4AmfQsYxQspB9tuhtfGO/2BfRh7zY29Ev8yZqFmTHfUm2kYAb9L4NVB4osAxkfCItN3ZPNaQgv0bcD9ep3hw2PR4/X6F2Nakx6v10Ui7RsBw+8k+BzjfYqERfglhlefRj+jxBJLxJfNDoIvID4MH9jzWxB+G8MrBUTi2+CDR8MKfGHxUSS6E0l4vYBI0MeF7XQGKCE+ATQ34yoWeIfAWo7qkBEA/99UHBmtjJIgI+ZwWM7llVHyr4xjsx/f6VWGrvD2BhpzzojB+nklAPzB8TdtA9skZyBKpOxtn5lhcE4zvKc55e9+cgZSZmfZJoD/AdgWNR1vZJvmAAAAAElFTkSuQmCC',
                symbolEmboss: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEhElEQVRoge1ZzW8bRRQ3NCWrfJS0+VACoUppqoamqEXqgUMlcsjBhx449NAD4r43iKhE/JX35u3OeG0rK63kwwqJufsv8AWZ/4QbQgjxIYEQlx0OmU23xvbO2msnSPlJq0SJ897v995v3sxsCoUrXOEK6ZDS2iEqziwfUfFASiufYFJaG4jdl4hRBdHOJ+gIINrvIEZlxK6cWISU1ipi9ysAdQygSohRbZoiEO0txKgEoMoACiYSIaV1E7F7pIOVAVQFQNUQI5yGCER7EzFK5tL5upBZhJTWDcTulwCqlAhWAVBVAFXJ206I9nqi8sl8ZQBVziRCSmsRsfvFgGDJoLnZCdFeQ4y+HpGvokX8YCJinah4hBgNC1SB1+00kQhEe3VI5fufHxEjZToJa4h2OUVEbKfyuHZCtG8hRscG5H9CjFTWHBVDEbq92Tqhyfcv2EEF+nkc8jFqiHbFQERZL2yj6YRor+iYo8ifAKhfJiGfFGHaiWpaJxDtZQPPVwHUr3mQT4ow6URl1HRCtJcMPH8CoH7Lk/yr/OZ2+s+aQLQXDafN79MgH8PETucEEaNDRLuAaC8YVL4GoP6YJvmkCJNOxCO2bDBtTgDUn7MgnxRhsrBL+klbsH/NknwMk32inCBZHfKZCyEfI4udqn2iagDq74skH8N0Op1PKP39P5eBfIxPEO2SXqxpAqpwdgi8NOQLhUKhgGgfGwg4H5mI0XeXRsDZrDfapF57ZnXHNiFvciQ22rEvgnzaJpU6oaZ1xzYhb7JJXT47afJpd9gEMaMRe4wYHU9dhGHlawBK6VH5/TQuRZOQN/G86pvzuV6KJiGfpfL9IXK5FE1C3uRIPIz8q1CztlOGaZNGPsbs7JTYpEYlMan8IBHGB8CxRPTZpv8oPGrBZhFh2olKJhFExUG2GbQGxiUfw/TlWQ1AfWP6anFHSquE2B30ljgONmraZEWanaoA6tuzfF1l+oYapLSqiN1BwcbxfBqGTacqgJJZySdFHA0QkTf5GP1rogqgGuOSj5HsRJ62GYaknZqTko8Ri5g2+Rg1RLt5lmty8jGUlJbxPxfyyEdUzI38/xK9Xm8uCIL5MAwXPM9b9n1/hXO+2mw2N1zX3fI8b7ter98mojtEdJeI7hHRfc75Huf8AWNs33Xdh/0PY2yfc/6Ac75HRPf1390lojv1ev2253nbrutuNZvNDc75qu/7K57nLYdhuBAEwXyv15sbSLjT6VwLgmC+3W4v+b6/0mq11hqNxqbnedtCiB0hxC7nfE8Teew4zhPHcT52HOcpER0Q0SERFYnoGRF9SkTPGWMvGGOfMcY+119fENFz/ftn+vOHRHTgOM5THe+J67qPXdd9yDnfE0LsCiF2PM/bbjQam61Wa833/ZVms7kYhuF1pdQbAwUppd7s9XpznU7nLSmlFXeiXq+/fXp6eotzvt5oNDYdx3k37oQQYldX9QPG2IeMsUeMsY/080j/bF9X/54Q4n0hxI7jOO/FVW+1WmtCiJtBENxot9tLYRgu6PzXO53OtUGE/wX0hmmwt596DgAAAABJRU5ErkJggg==',
                key: '',
                /***************************************** changes applied *****************************************/
                keys: [{ key: '1', value: 'First' }, { key: '2', value: 'Second' }],
                /***************************************** changes applied *****************************************/
                strictPunctuation: false,
                series: [],
                teacherSeries: []
            }
        },
        getEmptyStemLeafPlot: function () {
            return {
                leafDelimiter: '-',
                strictPunctuation: false,
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                stems: [],
                teacherStems: []
            }
        },
        getEmptyFrequencyPolygonChart: function () {
            return {
                plotAreaPadding: { top: 45, left: 45, right: 25, bottom: 35 },
                title: 'Title',
                xAxisTitle: 'X Label',
                yAxisTitle: 'Y Label',
                gridLineStyle: { id: 'solid', name: 'Solid' },
                connectorLineStyle: { id: 'solid', name: 'Solid' },
                strictPunctuation: false,
                xAxisMin: 0,
                xAxisMax: 100,
                xInterval: 10,
                yAxisMin: 0,
                yAxisMax: 10,
                yAxisScale: 1,
                yInterval: 1,
                intervals: [],
                teacherIntervals: []
            }
        },
        completeSettings: function (settings) {
            this.completeBarChart(settings.barChart);
            this.completeLineChart(settings.lineChart);
            this.completeScatterPlot(settings.scatterPlot);
            this.completePieChart(settings.pieChart);
            this.completeHistogram(settings.histogram);
            this.completePictogram(settings.pictogram);
            this.completeStemLeafPlot(settings.stemLeafPlot);
            this.completeFrequencyPolygonChart(settings.frequencyPolygonChart);
        },

        completeLineChart: function (lineChart) {
            lineChart.connectors = [];
            lineChart.teacherPoints = [];
            lineChart.teacherConnectors = []
        },
        completeBarChart: function (barChart) {
            barChart.teacherBars = []
        },
        completeScatterPlot: function (scatterPlot) {
            scatterPlot.connectors = [];
            scatterPlot.teacherPoints = [];
            scatterPlot.teacherConnectors = []
        },
        completePieChart: function (pieChart) {
            teacherSlices = []
        },
        completeHistogram: function (histogram) {
            histogram.teacherIntervals = []
        },
        completePictogram: function (pictogram) {
            pictogram.teacherSeries = []
        },
        completeStemLeafPlot: function (stemLeafPlot) {
            stemLeafPlot.teacherStems = []
        },
        completeFrequencyPolygonChart: function (frequencyPolygonChart) {
            frequencyPolygonChart.teacherIntervals = []
        }
    }
});
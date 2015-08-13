using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineTests.Web.Models
{
    public class QuestionViewModel
    {
        //public int questionId { get; set; }
        public int? id { get; set; }
        public string questionType { get; set; }
        public string questionText { get; set; }
        public string questionNotes { get; set; }
        public string interactiveChart { get; set; }
        public string divideAndSelectShape { get; set; }
        public string drawPointsInAChart { get; set; }
        public string shapesOverImage { get; set; }
        public string multipleDragAndDrop { get; set; }
    }

    public class ChartType
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class Container
    {
        public int width { get; set; }
        public int height { get; set; }
    }

    public class Grid
    {
        public int width { get; set; }
        public int height { get; set; }
    }

    public class GridLineStyle
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class ConnectorLineStyle
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class PlotAreaPadding
    {
        public int top { get; set; }
        public int left { get; set; }
        public int right { get; set; }
        public int bottom { get; set; }
    }

    public class Point
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int worth { get; set; }
    }

    public class LineChart
    {
        public int yAxisMin { get; set; }
        public int yAxisMax { get; set; }
        public int yAxisScale { get; set; }
        public int yIncrement { get; set; }
        public string title { get; set; }
        public string xAxisTitle { get; set; }
        public string yAxisTitle { get; set; }
        public bool strictPunctuation { get; set; }
        public GridLineStyle gridLineStyle { get; set; }
        public ConnectorLineStyle connectorLineStyle { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Point> points { get; set; }
    }

    public class BarChart
    {
        public int yAxisMin { get; set; }
        public int yAxisMax { get; set; }
        public int yAxisScale { get; set; }
        public int yIncrement { get; set; }
        public string title { get; set; }
        public string xAxisTitle { get; set; }
        public string yAxisTitle { get; set; }
        public bool strictPunctuation { get; set; }
        public GridLineStyle gridLineStyle { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<object> bars { get; set; }
    }

    public class ScatterPlot
    {
        public int yAxisMin { get; set; }
        public int yAxisMax { get; set; }
        public int yAxisScale { get; set; }
        public int yIncrement { get; set; }
        public string title { get; set; }
        public string xAxisTitle { get; set; }
        public string yAxisTitle { get; set; }
        public bool strictPunctuation { get; set; }
        public GridLineStyle gridLineStyle { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<object> points { get; set; }
    }

    public class PieChart
    {
        public int totalArea { get; set; }
        public int scale { get; set; }
        public bool labelOutsideLocation { get; set; }
        public bool strictPunctuation { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<object> slices { get; set; }
    }

    public class Histogram
    {
        public PlotAreaPadding plotAreaPadding { get; set; }
        public int xAxisMin { get; set; }
        public int xAxisMax { get; set; }
        public int xInterval { get; set; }
        public int yAxisMin { get; set; }
        public int yAxisMax { get; set; }
        public int yAxisScale { get; set; }
        public int yInterval { get; set; }
        public List<object> intervals { get; set; }
    }

    public class Pictogram
    {
        public int serieValueMax { get; set; }
        public int symbolValue { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<object> series { get; set; }
    }

    public class StemLeafPlot
    {
        public string leafDelimiter { get; set; }
        public bool strictPunctuation { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<object> stems { get; set; }
    }

    public class FrequencyPolygonChart
    {
        public PlotAreaPadding plotAreaPadding { get; set; }
        public string title { get; set; }
        public string xAxisTitle { get; set; }
        public string yAxisTitle { get; set; }
        public GridLineStyle gridLineStyle { get; set; }
        public ConnectorLineStyle connectorLineStyle { get; set; }
        public int xAxisMin { get; set; }
        public int xAxisMax { get; set; }
        public int xInterval { get; set; }
        public int yAxisMin { get; set; }
        public int yAxisMax { get; set; }
        public int yAxisScale { get; set; }
        public int yInterval { get; set; }
        public List<object> intervals { get; set; }
    }

    public class InteractiveChartViewModel
    {
        public ChartType chartType { get; set; }
        public Container container { get; set; }
        public Grid grid { get; set; }
        public LineChart lineChart { get; set; }
        public BarChart barChart { get; set; }
        public ScatterPlot scatterPlot { get; set; }
        public PieChart pieChart { get; set; }
        public Histogram histogram { get; set; }
        public Pictogram pictogram { get; set; }
        public StemLeafPlot stemLeafPlot { get; set; }
        public FrequencyPolygonChart frequencyPolygonChart { get; set; }
    }


}
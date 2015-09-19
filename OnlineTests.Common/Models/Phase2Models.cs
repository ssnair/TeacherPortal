using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Common.Models
{
    #region InteractiveChart

    [Serializable]
    public class InteractiveChart : Question
    {
        public int id { get; set; }
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

        public InteractiveChartSettings GetSettings()
        {
            return new InteractiveChartSettings()
            {
                chartType = this.chartType,
                container = this.container,
                grid = this.grid,
                lineChart = this.lineChart,
                barChart = this.barChart,
                scatterPlot = this.scatterPlot,
                pieChart = this.pieChart,
                histogram = this.histogram,
                pictogram = this.pictogram,
                stemLeafPlot = this.stemLeafPlot,
                frequencyPolygonChart = this.frequencyPolygonChart
            };
        }
    }

    [DataContract]
    public class InteractiveChartSettings
    {
        [DataMember]
        public ChartType chartType { get; set; }
        [DataMember]
        public Container container { get; set; }
        [DataMember]
        public Grid grid { get; set; }
        [DataMember]
        public LineChart lineChart { get; set; }
        [DataMember]
        public BarChart barChart { get; set; }
        [DataMember]
        public ScatterPlot scatterPlot { get; set; }
        [DataMember]
        public PieChart pieChart { get; set; }
        [DataMember]
        public Histogram histogram { get; set; }
        [DataMember]
        public Pictogram pictogram { get; set; }
        [DataMember]
        public StemLeafPlot stemLeafPlot { get; set; }
        [DataMember]
        public FrequencyPolygonChart frequencyPolygonChart { get; set; }
    }

    [DataContract]
    public class ChartType
    {
        [DataMember]
        public string id { get; set; }
        [DataMember]
        public string name { get; set; }
    }

    public class Container
    {
        public string width { get; set; }
        public string height { get; set; }
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

    public class Slice
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int oldValue { get; set; }
        public int worth { get; set; }
        public double percentage { get; set; }
        public string color { get; set; }
    }

    public class Bar
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int worth { get; set; }
        public string color { get; set; }
    }

    public class Stem
    {
        public string uuid { get; set; }
        public int label { get; set; }
        public int order { get; set; }
        public List<int> value { get; set; }
        public string stringValue { get; set; }
        public int worth { get; set; }
    }

    public class Guide
    {
        public int value { get; set; }
        public string meaning { get; set; }
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
        public List<Bar> bars { get; set; }
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
        public List<Point> points { get; set; }
    }

    public class PieChart
    {
        public string title { get; set; }
        public int totalArea { get; set; }
        public int scale { get; set; }
        public bool labelOutsideLocation { get; set; }
        public bool strictPunctuation { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Slice> slices { get; set; }
    }

    public class HistogramInterval
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int worth { get; set; }
        public int start { get; set; }
        public int end { get; set; }
        public string color { get; set; }
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
        public string title { get; set; }
        public string xAxisTitle { get; set; }
        public string yAxisTitle { get; set; }
        public GridLineStyle gridLineStyle { get; set; }
        public bool strictPunctuation { get; set; }
        public List<HistogramInterval> intervals { get; set; }
    }

    public class PictogramSeries
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int worth { get; set; }
    }

    public class Pictogram
    {
        public PlotAreaPadding plotAreaPadding { get; set; }
        public bool strictPunctuation { get; set; }
        public int seriesValue { get; set; }
        public int symbolValue { get; set; }
        public int symbolWidth { get; set; }
        public int symbolHeight { get; set; }
        public decimal symbolSize { get; set; }
        public string symbol { get; set; }
        public string symbolEmboss { get; set; }
        public string key { get; set; }
        public string title { get; set; }
        public List<Guide> keys { get; set; }
        public List<PictogramSeries> series { get; set; }
    }

    public class StemLeafPlot
    {
        public string leafDelimiter { get; set; }
        public bool strictPunctuation { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Stem> stems { get; set; }
    }

    public class FrequencyPolygonInterval
    {
        public string uuid { get; set; }
        public string label { get; set; }
        public int order { get; set; }
        public int value { get; set; }
        public int worth { get; set; }
        public int start { get; set; }
        public int end { get; set; }
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
        public bool strictPunctuation { get; set; }
        public List<FrequencyPolygonInterval> intervals { get; set; }
    }
    #endregion Interactive chart

    #region DivideAndSelectShape
    public class ShapeType
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class AnswerMode
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class Sector
    {
        public bool selected { get; set; }
    }

    public class PolygonShape
    {
        public int sides { get; set; }
        public int worth { get; set; }
        public AnswerMode answerMode { get; set; }
        public int angle { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Sector> sectors { get; set; }
    }

    public class CircleShape
    {
        public int divisions { get; set; }
        public int worth { get; set; }
        public AnswerMode answerMode { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Sector> sectors { get; set; }
    }

    public class DivisionType
    {
        public string id { get; set; }
    }

    public class RectangleShape
    {
        public int width { get; set; }
        public int height { get; set; }
        public int columns { get; set; }
        public int rows { get; set; }
        public int worth { get; set; }
        public AnswerMode answerMode { get; set; }
        public DivisionType divisionType { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Sector> sectors { get; set; }
        public List<object> grid { get; set; }
    }

    public class StarShape
    {
        public int peaks { get; set; }
        public int worth { get; set; }
        public int angle { get; set; }
        public AnswerMode answerMode { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public List<Sector> sectors { get; set; }
    }

    [DataContract]
    public class DivideAndSelectShapeSettings
    {
        [DataMember]
        public ShapeType shapeType { get; set; }
        [DataMember]
        public Container container { get; set; }
        [DataMember]
        public PolygonShape polygonShape { get; set; }
        [DataMember]
        public CircleShape circleShape { get; set; }
        [DataMember]
        public RectangleShape rectangleShape { get; set; }
        [DataMember]
        public StarShape starShape { get; set; }
    }

    public class DivideAndSelectShape : Question
    {
        public ShapeType shapeType { get; set; }
        public Container container { get; set; }
        public PolygonShape polygonShape { get; set; }
        public CircleShape circleShape { get; set; }
        public RectangleShape rectangleShape { get; set; }
        public StarShape starShape { get; set; }

        public DivideAndSelectShapeSettings GetSettings()
        {
            return new DivideAndSelectShapeSettings()
            {
                shapeType = this.shapeType,
                container = this.container,
                polygonShape = this.polygonShape,
                circleShape = this.circleShape,
                rectangleShape = this.rectangleShape,
                starShape = this.starShape,
            };
        }
    }

    #endregion  DivideAndSelectShape

    #region DrawPointsInAChart
    public class GridPosition
    {
        public int x { get; set; }
        public int y { get; set; }
    }

    public class DrawLinesInAChartPoint
    {
        public string uuid { get; set; }
        public GridPosition gridPosition { get; set; }
        public int worth { get; set; }
    }

    public class Connection
    {
        public string uuid { get; set; }
        public string point1 { get; set; }
        public string point2 { get; set; }
        public string connectionType { get; set; }
    }

    public class ScaleMode
    {
        public string id { get; set; }
    }

    public class AnswerType
    {
        public string id { get; set; }
    }

    public class DistanceType
    {
        public string id { get; set; }
    }

    public class DistanceBetweenTwoPoints
    {
        public DistanceType distanceType { get; set; }
        public int distance { get; set; }
        public int worth { get; set; }
    }

    public class DrawLinesInAChart_Dot
    {
        public int radius { get; set; }
    }

    public class DrawPointsInAChart : Question
    {
        public Container container { get; set; }
        public Grid grid { get; set; }
        public DrawLinesInAChart_Dot dot { get; set; }
        public bool strictPunctuation { get; set; }
        public List<DrawLinesInAChartPoint> points { get; set; }
        public List<Connection> connections { get; set; }
        public ScaleMode scaleMode { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public AnswerType answerType { get; set; }
        public DistanceBetweenTwoPoints distanceBetweenTwoPoints { get; set; }

        public DrawPointsInAChartSettings GetSettings()
        {
            return new DrawPointsInAChartSettings()
            {
                container = this.container,
                grid = this.grid,
                strictPunctuation = this.strictPunctuation,
                dot = this.dot,
                points = this.points,
                connections = this.connections,
                scaleMode = this.scaleMode,
                plotAreaPadding = this.plotAreaPadding,
                answerType = this.answerType,
                distanceBetweenTwoPoints = this.distanceBetweenTwoPoints
            };
        }

    }

    [DataContract]
    public class DrawPointsInAChartSettings
    {
        [DataMember]
        public Container container { get; set; }
        [DataMember]
        public Grid grid { get; set; }
        [DataMember]
        public DrawLinesInAChart_Dot dot { get; set; }
        [DataMember]
        public bool strictPunctuation { get; set; }
        [DataMember]
        public List<DrawLinesInAChartPoint> points { get; set; }
        [DataMember]
        public List<Connection> connections { get; set; }
        [DataMember]
        public ScaleMode scaleMode { get; set; }
        [DataMember]
        public PlotAreaPadding plotAreaPadding { get; set; }
        [DataMember]
        public AnswerType answerType { get; set; }
        [DataMember]
        public DistanceBetweenTwoPoints distanceBetweenTwoPoints { get; set; }
    }
    #endregion

    #region ShapeOverImage

    public class PolygonPoint
    {
        public string uuid { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }


    public class Position
    {
        public int x { get; set; }
        public int y { get; set; }
    }

    public class Size
    {
        public int height { get; set; }
        public int width { get; set; }
    }

    public class ShapesOverImageShape
    {
        public string uuid { get; set; }
        public string shapeType { get; set; }
        public Position position { get; set; }
        public Size size { get; set; }
        public string worth { get; set; }
        public int threshold { get; set; }
        public List<PolygonPoint> points { get; set; }
    }

    public class ShapesOverImage : Question
    {
        public Container container { get; set; }
        public List<ShapesOverImageShape> shapes { get; set; }
        public PlotAreaPadding plotAreaPadding { get; set; }
        public AnswerType answerType { get; set; }
        public string image { get; set; }

        public ShapesOverImageSettings GetSettings()
        {
            return new ShapesOverImageSettings()
            {
                container = this.container,
                shapes = this.shapes,
                plotAreaPadding = this.plotAreaPadding,
                answerType = this.answerType,
                image = this.image
            };
        }
    }

    [DataContract]
    public class ShapesOverImageSettings
    {
        [DataMember]
        public Container container { get; set; }
        [DataMember]
        public List<ShapesOverImageShape> shapes { get; set; }
        [DataMember]
        public PlotAreaPadding plotAreaPadding { get; set; }
        [DataMember]
        public AnswerType answerType { get; set; }
        [DataMember]
        public string image { get; set; }
    }

    #endregion

    #region MultipleDragAndDrap3
    // renamed to MultipleDragAndDrop3 because we already had MultipleDragAndDrop and MultipleDragAndDrop2
    public class Option
    {
        public string uuid { get; set; }
        public string value { get; set; }
        public string oldValue { get; set; }
        public string worth { get; set; }
        public int order { get; set; }
    }

    public class Target
    {
        public string uuid { get; set; }
        public string teacherValue { get; set; }
        public string worth { get; set; }
    }

    public class MultipleDragAndDrop3 : Question
    {
        public Container container { get; set; }
        public string contents { get; set; }
        public bool StrictPunctuation { get; set; }
        public List<Option> options { get; set; }
        public List<Target> targets { get; set; }

        public MultipleDragAndDrop3Settings GetSettings()
        {
            return new MultipleDragAndDrop3Settings()
            {
                container = this.container,
                contents = this.contents,
                StrictPunctuation = this.StrictPunctuation,
                options = this.options,
                targets = this.targets
            };
        }
    }

    [DataContract]
    public class MultipleDragAndDrop3Settings
    {
        [DataMember]
        public Container container { get; set; }
        [DataMember]
        public string contents { get; set; }
        [DataMember]
        public bool StrictPunctuation { get; set; }
        [DataMember]
        public List<Option> options { get; set; }
        [DataMember]
        public List<Target> targets { get; set; }
    }
    #endregion

} // end namesapce

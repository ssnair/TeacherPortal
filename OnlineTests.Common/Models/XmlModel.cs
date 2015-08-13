using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace OnlineTests.Common.Models
{
    public class MovePointsInAChart_QuestionXmlModel
    {
        public decimal Domain { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }
        public decimal chartType { get; set; }
    }

    public class MovePointsInAChart_SpotXmlModel
    {
        public string SpotType { get; set; }
        public decimal X { get; set; }
        public decimal Y { get; set; }
    }

    public class MovePointsInALine_QuestionXmlModel
    {
        public decimal MinValue { get; set; }

        public decimal MaxValue { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }
    }

    public class MovePointsInALine_IntervalXmlModel
    {
        public int Id { get; set; }
        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public string MinValueType { get; set; }
        public string MaxValueType { get; set; }
        public string ShapeType { get; set; }
        public decimal Value { get; set; }
        public string Label { get; set; }
    }

    public class SelectableChart_ColumnXmlModel
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public decimal Value { get; set; }

        public bool Selected { get; set; }
    }

    public class MultipleDragAndDrop_QuestionXmlModel
    {
        [XmlArray("Answers")]
        public MultipleDragAndDrop_AnswerXmlModel[] Answers { get; set; }
    }

    public class MultipleDragAndDrop_AnswerXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Int16 DisplayAnswersVertically { get; set; }
    }

    public class MultipleDragAndDrop_TargetXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
    }

    public class MultipleDragAndDrop_JustificationQuestionXmlModel
    {
        [XmlArray("JustificationAnswers")]
        public MultipleDragAndDrop_JustificationAnswerXmlModel[] JustificationAnswers { get; set; }

        [XmlArray("Answers")]
        public MultipleDragAndDrop_AnswerXmlModel[] Answers { get; set; }
    }

    public class MultipleDragAndDrop_JustificationAnswerXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
    }

    public class MultipleDragAndDrop_JustificationTargetXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
    }

    public class DragAndOrder_OptionXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public decimal Worth { get; set; }
    }

    public class DrawLinesInAChart_QuestionXmlModel
    {
        public decimal Domain { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }
    }

    public class DrawLinesInAChart_AnswerXmlModel
    {
        public Int16 axisValue { get; set; }
        public string axisType { get; set; }
    }

    public class MultipleDragAndDropExpression_QuestionXmlModel
    {
        [XmlArray("Answers")]
        public MultipleDragAndDropExpression_AnswerXmlModel[] Answers { get; set; }
    }

    public class MultipleDragAndDropExpression_AnswerXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
    }

    public class MultipleDragAndDropExpression_TargetXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
        public string Shape { get; set; }
        public string Container { get; set; }
        public bool ContainerLabel { get; set; }
        public bool ContainerBorder { get; set; }
        public string ContainerPosition { get; set; }
    }

    public class MultipleDragAndDrop2_QuestionXmlModel
    {
        [XmlArray("Answers")]
        public MultipleDragAndDrop2_AnswerXmlModel[] Answers { get; set; }
    }

    public class MultipleDragAndDrop2_AnswerXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Int16 DisplayAnswersVertically { get; set; }
    }

    public class MultipleDragAndDrop2_TargetXmlModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        [XmlArray("Answers")]
        public MultipleDragAndDrop2_TargetAnswerXmlModel[] Answers { get; set; }
    }

    public class MultipleDragAndDrop2_TargetAnswerXmlModel
    {
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
    }

} // end name space

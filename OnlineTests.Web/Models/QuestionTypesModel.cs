using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Mvc;

namespace OnlineTests.Web.Models
{
    public class MovePointsInAChartModel : QuestionModel
    {
        [DataMember(Name = "domain")]
        public decimal Domain { get; set; }

        [DataMember(Name = "chartType")]
        public decimal chartType { get; set; }

        [DataMember(Name = "majorScale")]
        public decimal MajorScale { get; set; }

        [DataMember(Name = "minorScale")]
        public decimal MinorScale { get; set; }

        [DataMember(Name = "centerSpot")]
        public SpotContent CenterSpot { get; set; }

        [DataMember(Name = "minMaxSpot")]
        public SpotContent MinMaxSpot { get; set; }

        [DataMember(Name = "answerType")]
        public int answerType { get; set; }

    }

    public class MovePointsInALineModel : QuestionModel
    {
        [DataMember(Name = "minValue")]
        public decimal MinValue { get; set; }

        [DataMember(Name = "maxValue")]
        public decimal MaxValue { get; set; }

        [DataMember(Name = "majorScale")]
        public decimal MajorScale { get; set; }

        [DataMember(Name = "minorScale")]
        public decimal MinorScale { get; set; }

        [DataMember(Name = "intervals")]
        public MovePointInALine_Interval[] Intervals { get; set; }
    }

    public class MovePointInALine_Interval
    { 
        [DataMember(Name = "id")]
        public int Id { get; set; }
        [DataMember(Name = "minValue")]
        public decimal MinValue { get; set; }
        [DataMember(Name = "maxValue")]
        public decimal MaxValue { get; set; }
        [DataMember(Name = "minValueType")]
        public string MinValueType { get; set; }
        [DataMember(Name = "maxValueType")]
        public string MaxValueType { get; set; }
        [DataMember(Name = "value")]
        public decimal Value { get; set; }
        [DataMember(Name = "shapeType")]
        public string ShapeType { get; set; }
        [DataMember(Name = "label")]
        public string Label { get; set; }
        [DataMember(Name = "q1Value")]
        public decimal Q1Value { get; set; }
        [DataMember(Name = "q2Value")]
        public decimal Q2Value { get; set; }
        [DataMember(Name = "q3Value")]
        public decimal Q3Value { get; set; }
    }

    public class SelectableChartModel : QuestionModel
    {
        [DataMember(Name = "chartColumns")]
        public SelectableChart_Column[] ChartColumns{ get; set; }

        [DataMember(Name = "worth")]
        public decimal Worth { get; set; }
    }

    public class SelectableChart_Column
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "etiqueta")]
        public string Etiqueta { get; set; }

        [DataMember(Name = "valor")]
        public decimal Valor { get; set; }

        [DataMember(Name = "option")]
        public bool Option { get; set; }
    }

    public class MultipleDragAndDropModel : QuestionModel
    {
         [DataMember(Name = "answers")]
        public MultipleDragAndDrop_Answer[] Answers { get; set; }

         [DataMember(Name = "targets")]
        public MultipleDragAndDrop_Target[] Targets { get; set; }
    }

    public class MultipleDragAndDrop_Answer
    {
        public int Id { get; set; }

        [AllowHtml]
        public string Text { get; set; }

        public Int16 DisplayAnswersVertically { get; set; }
    }

    public class MultipleDragAndDrop_Target
    {
        public int Id { get; set; }
        [AllowHtml]
        public string Text { get; set; }

        public int AnswerId { get; set; }
        [AllowHtml]
        public string AnswerText  { get; set; }
    }

    public class DragAndOrderModel : QuestionModel
    {
        [DataMember(Name = "options")]
        public DragAndOrder_Option[] Options { get; set; }
    }

    public class DragAndOrder_Option
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public decimal Worth { get; set; }
    }

    public class MultipleDragAndDropImageModel : QuestionModel
    {
        [DataMember(Name = "answers")]
        public MultipleDragAndDropImageModel_Answer[] Answers { get; set; }
    }

    public class MultipleDragAndDropImageModel_Answer
    {
        public string imgName { get; set; }
        public string imgData { get; set; }
        public Int16 isCorrect { get; set; }
    }

    public class MultipleDragAndDropJustificationModel : MultipleDragAndDropModel
    {
        [DataMember(Name = "justification_answers")]
        public MultipleDragAndDrop_JustificationAnswer[] Justification_Answers { get; set; }

        [DataMember(Name = "justification_targets")]
        public MultipleDragAndDrop_JustificationTarget[] Justification_Targets { get; set; }
    }

    public class MultipleDragAndDrop_JustificationAnswer
    {
        public int Id { get; set; }

        [AllowHtml]
        public string Text { get; set; }
    }

    public class MultipleDragAndDrop_JustificationTarget
    {
        public int Id { get; set; }
        [AllowHtml]
        public string Text { get; set; }

        public int AnswerId { get; set; }
        [AllowHtml]
        public string AnswerText { get; set; }
    }

    public class DrawLinesInAChartModel : QuestionModel
    {
        [DataMember(Name = "domain")]
        public decimal Domain { get; set; }

        [DataMember(Name = "majorScale")]
        public decimal MajorScale { get; set; }

        [DataMember(Name = "minorScale")]
        public decimal MinorScale { get; set; }

        [DataMember(Name = "answers")]
        public MovePointsInAChartAnswer[] Answers { get; set; }
    }

    public class MovePointsInAChartAnswer
    {
        public Int16 axisValue { get; set; }
        public string axisType { get; set; }
    }

    public class MultipleDragAndDropExpressionModel : QuestionModel
    {
        [DataMember(Name = "answers")]
        public MultipleDragAndDropExpression_Answer[] Answers { get; set; }

        [DataMember(Name = "targets")]
        public MultipleDragAndDropExpression_Target[] Targets { get; set; }
    }

    public class MultipleDragAndDropExpression_Answer
    {
        public int Id { get; set; }

        [AllowHtml]
        public string Text { get; set; }
    }

    public class MultipleDragAndDropExpression_Target
    {
        public int Id { get; set; }
        [AllowHtml]
        public string Text { get; set; }
        public int AnswerId { get; set; }
        [AllowHtml]
        public string AnswerText { get; set; }
        public string Shape { get; set; }
        public string Container { get; set; }
        public bool ContainerLabel { get; set; }
        public bool ContainerBorder { get; set; }
        public string ContainerPosition { get; set; }
    }

    public class MultipleDragAndDrop2Model : QuestionModel
    {
        [DataMember(Name = "answers")]
        public MultipleDragAndDrop2_Answer[] Answers { get; set; }

        [DataMember(Name = "targets")]
        public MultipleDragAndDrop2_Target[] Targets { get; set; }
    }

    public class MultipleDragAndDrop2_Answer
    {
        public int Id { get; set; }

        [AllowHtml]
        public string Text { get; set; }

        public Int16 DisplayAnswersVertically { get; set; }
    }

    public class MultipleDragAndDrop2_Target
    {
        public int Id { get; set; }

        [AllowHtml]
        public string Text { get; set; }

        public MultipleDragAndDrop2_TargetAnswer[] Answers { get; set; }
    }

    public class MultipleDragAndDrop2_TargetAnswer
    {
        public int AnswerId { get; set; }
        
        [AllowHtml]
        public string AnswerText { get; set; }
    }

} // end name space
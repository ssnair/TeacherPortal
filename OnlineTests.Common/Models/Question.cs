using System;
using System.Collections;
using System.Collections.Generic;

namespace OnlineTests.Common.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int? MasterQuestionId { get; set; }
        public int? IdFromOldOT { get; set; }
        public short? SubjectId { get; set; }
        public string GradeLevel { get; set; }
        public byte? QuestionTypeId { get; set; }
        public string QuestionText { get; set; }
        public int? PassageId { get; set; }
        public int? PassageIdFromOldOT { get; set; }
        public string Complexity { get; set; }
        public string Difficulty { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? ModifyDate { get; set; }
        public int? CreateUserId { get; set; }
        public int? ModifyUserId { get; set; }
        public short? MinScore { get; set; }
        public short? MaxScore { get; set; }
        public short? Targ { get; set; }
        public string CourseId { get; set; }
        public string Notes { get; set; }
        public byte? StatusId { get; set; }
        public DateTime? ApproveDate { get; set; }
        public int? ApproveUser { get; set; }
        public string ExtendedDetails { get; set; }

        public List<IQuestionComponent> Components { get; set; }
        public List<Answer> Answers { get; set; }

        public Question()
        {

        }

        public Question(Question src)
        {
            ApproveDate = src.ApproveDate;
            ApproveUser = src.ApproveUser;
            Complexity = src.Complexity;
            Components = null;
            CourseId = src.CourseId;
            CreateDate = src.CreateDate;
            CreateUserId = src.CreateUserId;
            Difficulty = src.Difficulty;
            ExtendedDetails = src.ExtendedDetails;
            GradeLevel = src.GradeLevel;
            Id = src.Id;
            IdFromOldOT = src.IdFromOldOT;
            MasterQuestionId = src.MasterQuestionId;
            MaxScore = src.MaxScore;
            MinScore = src.MinScore;
            ModifyDate = src.ModifyDate;
            ModifyUserId = src.ModifyUserId;
            Notes = src.Notes;
            PassageId = src.PassageId;
            PassageIdFromOldOT = src.PassageIdFromOldOT;
            QuestionText = src.QuestionText;
            QuestionTypeId = src.QuestionTypeId;
            StatusId = src.StatusId;
            SubjectId = src.SubjectId;
            Targ = src.Targ;
            Answers = src.Answers;
        }

    }

    [Serializable]
    public class MovePointsInAChart : Question 
    {
        public decimal Domain { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }

        public decimal chartType { get; set; }

        public int AnswerType { get; set; }

        public SpotContent CenterSpot { get; set; }

        public SpotContent MinMaxSpot { get; set; }

        public MovePointsInAChart()
        {
            this.Answers = new List<Answer>();
        }

        public MovePointsInAChart(Question src)
            :base(src)
        {
        }
    }

    [Serializable]
    public class MovePointsInAChartAnswer
    {
        public int SpotType { get; set; }

        public decimal X { get; set; }

        public decimal Y { get; set; }

        public decimal Worth { get; set; }
    }

    public class SpotContent
    {
        public decimal X { get; set; }

        public decimal Y { get; set; }
    }

    [Serializable]
    public class MovePointsInALine : Question
    {
        public decimal MinValue { get; set; }

        public decimal MaxValue { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }

        public MovePointsInALine_Interval[] Intervals { get; set; }

        public MovePointsInALine()
        {
            this.Answers = new List<Answer>();
        }

        public MovePointsInALine(Question src)
            : base(src)
        {
           
        }
    }

    public class MovePointsInALine_Interval
    {
        public int id { get; set; }
        public decimal minValue { get; set; }
        public decimal maxValue { get; set; }
        public string minValueType { get; set; }
        public string maxValueType { get; set; }
        public decimal value { get; set; }
        public string shapeType { get; set; }
        public string label { get; set; }
        public decimal q1Value { get; set; }
        public decimal q2Value { get; set; }
        public decimal q3Value { get; set; }
    }

    [Serializable]
    public class SelectableChart : Question
    {
        public decimal Worth { get; set; }

        public SelectableChart_Column[] Columns{ get; set; }

        public SelectableChart()
        {
            this.Answers = new List<Answer>();
        }

        public SelectableChart(Question src)
            : base(src)
        {

        }
    }

    public class SelectableChart_Column
    {
        public int id { get; set; }

        public string label { get; set; }

        public decimal value { get; set; }

        public bool selected { get; set; }
    }

    public class MultipleDragAndDrop : Question
    {
        public MultipleDragAndDrop_Answer[] AnswersList { get; set; }

        public MultipleDragAndDrop_Target[] Targets { get; set; }

        public MultipleDragAndDrop()
        {
            this.Answers = new List<Answer>();
        }

        public MultipleDragAndDrop(Question src)
            : base(src)
        {

        }
    }

    public class MultipleDragAndDrop_Answer
    {
        public int id { get; set; }
        public string text { get; set; }
        public Int16 displayAnswersVertically { get; set; }
        public int timesCanBeUsed { get; set; }
    }

    public class MultipleDragAndDrop_Target
    {
        public int id { get; set; }
        public string text { get; set; }
        public int answerId { get; set; }
        public string answerText { get; set; }
        public bool setContainerCapacity { get; set; }
        public int containerCapacity { get; set; }
        public MultipleDragAndDrop_TargetAnswerMatch[] answerOptions { get; set; }
    }

    public class MultipleDragAndDrop_TargetAnswerMatch
    {
        public int id { get; set; }
        public bool isCorrect { get; set; }
        public int worth { get; set; }
    }

    public class DragAndOrder : Question
    {
        public DragAndOrder_Option[] Options { get; set; }

         public DragAndOrder()
        {
            this.Answers = new List<Answer>();
        }

         public DragAndOrder(Question src)
            : base(src)
        {

        }
    }

    public class DragAndOrder_Option
    {
        public int id { get; set; }
        public string text { get; set; }
        public decimal worth { get; set; }
    }

    public class MultipleDragAndDropImage : Question
    {
        public MultipleDragAndDropImage_Answer[] AnswersList { get; set; }

         public MultipleDragAndDropImage()
        {
            this.Answers = new List<Answer>();
        }

        public MultipleDragAndDropImage(Question src)
            : base(src)
        {

        }
    }

    public class MultipleDragAndDropImage_Answer
    {
        public string imgName { get; set; }
        public string imgData { get; set; }
        public string imgURL { get; set; }
        public int? isCorrect { get; set; }
    }

    public class MultipleDragAndDropJustification : MultipleDragAndDrop
    {
        public MultipleDragAndDrop_JustificationAnswer[] JustificationAnswersList { get; set; }

        public MultipleDragAndDrop_JustificationTarget[] JustificationTargets { get; set; }

        public MultipleDragAndDropJustification()
        {
            this.Answers = new List<Answer>();
        }

        public MultipleDragAndDropJustification(Question src)
            : base(src)
        {

        }
    }

    public class MultipleDragAndDrop_JustificationAnswer
    {
        public int id { get; set; }
        public string text { get; set; }
    }

    public class MultipleDragAndDrop_JustificationTarget
    {
        public int id { get; set; }
        public string text { get; set; }
        public int answerId { get; set; }
        public string answerText { get; set; }
    }

    [Serializable]
    public class DrawLinesInAChart : Question
    {
        public decimal Domain { get; set; }

        public decimal MajorScale { get; set; }

        public decimal MinorScale { get; set; }

        public DrawLinesInAChartAnswer[] AnswersList { get; set; }

        public DrawLinesInAChart()
        {
            this.Answers = new List<Answer>();
        }

        public DrawLinesInAChart(Question src)
            : base(src)
        {
        }
    }

    [Serializable]
    public class DrawLinesInAChartAnswer
    {
        public Int16 axisValue { get; set; }

        public string axisType { get; set; }
    }

    public class MultipleDragAndDropExpression : Question
    {
        public MultipleDragAndDropExpression_Answer[] AnswersList { get; set; }

        public MultipleDragAndDropExpression_Target[] Targets { get; set; }

        public MultipleDragAndDropExpression()
        {
            this.Answers = new List<Answer>();
        }

        public MultipleDragAndDropExpression(Question src)
            : base(src)
        {

        }
    }

    public class MultipleDragAndDropExpression_Answer
    {
        public int id { get; set; }
        public string text { get; set; }

    }

    public class MultipleDragAndDropExpression_Target
    {
        public int id { get; set; }
        public string text { get; set; }
        public int answerId { get; set; }
        public string answerText { get; set; }
        public string shape { get; set; }
        public string container { get; set; }
        public bool containerLabel { get; set; }
        public bool containerBorder { get; set; }
        public string containerPosition { get; set; }
    }

    public class MultipleDragAndDropExpression_Container
    {
        public string container { get; set; }
        public bool containerLabel { get; set; }
        public bool containerBorder { get; set; }
        public string containerPosition { get; set; }
    }

    public class MultipleDragAndDrop2 : Question
    {
        public MultipleDragAndDrop2_Answer[] AnswersList { get; set; }

        public MultipleDragAndDrop2_Target[] Targets { get; set; }

        public MultipleDragAndDrop2()
        {
            this.Answers = new List<Answer>();
        }

        public MultipleDragAndDrop2(Question src)
            : base(src)
        {

        }
    }

    public class MultipleDragAndDrop2_Answer
    {
        public int id { get; set; }
        public string text { get; set; }
        public Int16 DisplayAnswersVertically { get; set; }

    }

    public class MultipleDragAndDrop2_Target
    {
        public int id { get; set; }
        public string text { get; set; }
        public MultipleDragAndDrop2_TargetAnswer[] Answers { get; set; }
    }

    public class MultipleDragAndDrop2_TargetAnswer
    {
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
    }


} // end name space

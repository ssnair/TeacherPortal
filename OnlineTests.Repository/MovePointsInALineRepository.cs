using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Helpers;
using OnlineTests.Common.Models;
using OnlineTests.Repository.Model;


namespace OnlineTests.Repository
{
    public class MovePointsInALineRepository : BaseRepository, IMovePointsInALineRepository
    {
        public void Create(MovePointsInALine question)
        {
            var questionXml = new MovePointsInALine_QuestionXmlModel
            {
                MinValue =  question.MinValue,
                MaxValue = question.MaxValue,
                MajorScale = question.MajorScale,
                MinorScale = question.MinorScale
            };

            var questionXmlSerialized = Serializer.Serialize(questionXml);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, questionXmlSerialized, questionId);

            question.Id = (int)questionId.Value;

            foreach (var interval in question.Intervals)
            {
                var intervalXml = new MovePointsInALine_IntervalXmlModel
                {
                    MinValue = interval.minValue,
                    MaxValue = interval.maxValue,
                    MinValueType = interval.minValueType,
                    MaxValueType = interval.maxValueType,
                    ShapeType = interval.shapeType,
                    Value = interval.value,
                    Label = interval.label
                };
                var intervalXmlSerialized = Serializer.Serialize(intervalXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", intervalXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }

        public void Update(MovePointsInALine question)
        {
            var questionXml = new MovePointsInALine_QuestionXmlModel
            {
                MinValue = question.MinValue,
                MaxValue = question.MaxValue,
                MajorScale = question.MajorScale,
                MinorScale = question.MinorScale
            };

            var questionXmlSerialized = Serializer.Serialize(questionXml);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, questionXmlSerialized);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            foreach (var interval in question.Intervals)
            {
                var intervalXml = new MovePointsInALine_IntervalXmlModel
                {
                    MinValue = interval.minValue,
                    MaxValue = interval.maxValue,
                    MinValueType = interval.minValueType,
                    MaxValueType = interval.maxValueType,
                    ShapeType = interval.shapeType,
                    Value = interval.value,
                    Label = interval.label
                };
                var intervalXmlSerialized = Serializer.Serialize(intervalXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", intervalXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

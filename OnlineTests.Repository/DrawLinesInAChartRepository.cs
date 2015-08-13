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
    public class DrawLinesInAChartRepository : BaseRepository, IDrawLinesInAChartRepository
    {
        public void Create(DrawLinesInAChart question)
        {
            var questionXml = new DrawLinesInAChart_QuestionXmlModel
            {
                Domain = question.Domain,
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

            foreach (var answer in question.AnswersList)
            {
                var columnXml = new DrawLinesInAChart_AnswerXmlModel
                {
                    axisValue = answer.axisValue,
                    axisType = answer.axisType
                };
                var columnXmlSerialized = Serializer.Serialize(columnXml);
                this.connection.Db.Answers_Insert(question.Id, "", 1, 0, 0, "", columnXmlSerialized);
            }
            this.connection.Db.SaveChanges();

        }

        public void Update(DrawLinesInAChart question)
        {
            var questionXml = new DrawLinesInAChart_QuestionXmlModel
            {
                Domain = question.Domain,
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

            foreach (var answer in question.AnswersList)
            {
                var columnXml = new DrawLinesInAChart_AnswerXmlModel
                {
                    axisValue = answer.axisValue,
                    axisType = answer.axisType
                };
                var columnXmlSerialized = Serializer.Serialize(columnXml);
                this.connection.Db.Answers_Insert(question.Id, "", 1, 0, 0, "", columnXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    } // end of class
} // end of namespace

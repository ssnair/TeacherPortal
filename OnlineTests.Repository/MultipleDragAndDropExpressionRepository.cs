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
    public class MultipleDragAndDropExpressionRepository : BaseRepository, IMultipleDragAndDropExpressionRepository
    {
        public void Create(MultipleDragAndDropExpression question)
        {
            var questionXml = new MultipleDragAndDropExpression_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDropExpression_AnswerXmlModel() 
                {
                    Id = x.id,
                    Text = x.text,
                }).ToArray()
            };
            var questionXmlSerialized = Serializer.Serialize(questionXml);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, questionXmlSerialized, questionId);

            question.Id = (int)questionId.Value;

            foreach (var target in question.Targets)
            {
                var targetXml = new MultipleDragAndDropExpression_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " ",
                    Shape = target.shape ?? " ",
                    Container = target.container ?? " ",
                    ContainerLabel = target.containerLabel,
                    ContainerBorder = target.containerBorder,
                    ContainerPosition = target.containerPosition 
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            this.connection.Db.SaveChanges();
        }

        public void Update(MultipleDragAndDropExpression question)
        {

            var questionXml = new MultipleDragAndDropExpression_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDropExpression_AnswerXmlModel()
                {
                    Id = x.id,
                    Text = x.text,
                }).ToArray()
            };
            var questionXmlSerialized = Serializer.Serialize(questionXml);
            
            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, questionXmlSerialized);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            foreach (var target in question.Targets)
            {
                var targetXml = new MultipleDragAndDropExpression_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    Container = target.container ?? " ",
                    Shape = target.shape ?? " ",
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " ",
                    ContainerLabel = target.containerLabel,
                    ContainerBorder = target.containerBorder,
                    ContainerPosition = target.containerPosition
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

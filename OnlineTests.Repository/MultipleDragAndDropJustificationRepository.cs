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
    public class MultipleDragAndDropJustificationRepository : BaseRepository, IMultipleDragAndDropJustificationRepository
    {
        public void Create(MultipleDragAndDropJustification question)
        {
            // method and justification answers
            var questionXml = new MultipleDragAndDrop_JustificationQuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop_AnswerXmlModel() 
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.displayAnswersVertically
                }).ToArray(),
                JustificationAnswers = question.JustificationAnswersList.Select(x => new MultipleDragAndDrop_JustificationAnswerXmlModel()
                {
                    Id = x.id,
                    Text = x.text,
                }).ToArray()

            };

            var questionXmlSerialized = Serializer.Serialize(questionXml); //+ Serializer.Serialize(questionXmlj);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, questionXmlSerialized, questionId);

            question.Id = (int)questionId.Value;

            // method responses
            foreach (var target in question.Targets)
            {
                var targetXml = new MultipleDragAndDrop_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " "
                };

                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            // justification responses
            foreach (var target in question.JustificationTargets)
            {
                var targetXml = new MultipleDragAndDrop_JustificationTargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " "
                };

                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            this.connection.Db.SaveChanges();
        }

        public void Update(MultipleDragAndDropJustification question)
        {
            // method and justification answers
            var questionXml = new MultipleDragAndDrop_JustificationQuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop_AnswerXmlModel()
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.displayAnswersVertically
                }).ToArray(),
                JustificationAnswers = question.JustificationAnswersList.Select(x => new MultipleDragAndDrop_JustificationAnswerXmlModel()
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

            // method responses
            foreach (var target in question.Targets)
            {
                var targetXml = new MultipleDragAndDrop_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " "
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            // justification responses
            foreach (var target in question.JustificationTargets)
            {
                var targetXml = new MultipleDragAndDrop_JustificationTargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    AnswerId = target.answerId,
                    AnswerText = target.answerText ?? " "
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }
            
            this.connection.Db.SaveChanges();
        }
    }
}

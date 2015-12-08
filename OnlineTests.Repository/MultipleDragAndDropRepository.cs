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
    public class MultipleDragAndDropRepository : BaseRepository, IMultipleDragAndDropRepository
    {
        public void Create(MultipleDragAndDrop question)
        {
            var questionXml = new MultipleDragAndDrop_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop_AnswerXmlModel() 
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.displayAnswersVertically,
                    TimesCanBeUsed = x.timesCanBeUsed
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
                var targetXml = new MultipleDragAndDrop_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    SetContainerCapacity = target.setContainerCapacity,
                    ContainerCapacity = target.containerCapacity,
                    AnswerText = string.Empty,
                    AnswerOptions = target.answerOptions.Select(x => new MultipleDragAndDrop_TargetAnswerMatchXmlModel 
                    { 
                        Id = x.id,
                        IsCorrect = x.isCorrect,
                        Worth = x.worth
                    }).ToArray()
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            this.connection.Db.SaveChanges();
        }

        public void Update(MultipleDragAndDrop question)
        {
         
            var questionXml = new MultipleDragAndDrop_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop_AnswerXmlModel()
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.displayAnswersVertically,
                     TimesCanBeUsed = x.timesCanBeUsed
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
                var targetXml = new MultipleDragAndDrop_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    ContainerCapacity = target.containerCapacity,
                    SetContainerCapacity = target.setContainerCapacity,
                    AnswerOptions = target.answerOptions.Select(x => new MultipleDragAndDrop_TargetAnswerMatchXmlModel 
                    { 
                        Id = x.id,
                        IsCorrect = x.isCorrect,
                        Worth = x.worth                    
                    }).ToArray()
                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

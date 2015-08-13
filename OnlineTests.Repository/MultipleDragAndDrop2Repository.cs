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
    public class MultipleDragAndDrop2Repository : BaseRepository, IMultipleDragAndDrop2Repository
    {
        public void Create(MultipleDragAndDrop2 question)
        {
            var questionXml = new MultipleDragAndDrop2_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop2_AnswerXmlModel() 
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.DisplayAnswersVertically
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
                var targetXml = new MultipleDragAndDrop2_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    Answers = target.Answers.Select(x => new MultipleDragAndDrop2_TargetAnswerXmlModel()
                                     {
                                         AnswerId = x.AnswerId,
                                         AnswerText = x.AnswerText
                                     }).ToArray(),
                };
               
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }

            this.connection.Db.SaveChanges();
        }

        public void Update(MultipleDragAndDrop2 question)
        {
         
            var questionXml = new MultipleDragAndDrop2_QuestionXmlModel()
            {
                Answers = question.AnswersList.Select(x => new MultipleDragAndDrop2_AnswerXmlModel()
                {
                    Id = x.id,
                    Text = x.text,
                    DisplayAnswersVertically = x.DisplayAnswersVertically
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
                var targetXml = new MultipleDragAndDrop2_TargetXmlModel
                {
                    Id = target.id,
                    Text = target.text,
                    Answers = target.Answers.Select(x => new MultipleDragAndDrop2_TargetAnswerXmlModel()
                                {
                                    AnswerId = x.AnswerId,
                                    AnswerText = x.AnswerText
                                }).ToArray(),

                };
                var targetXmlSerialized = Serializer.Serialize(targetXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", targetXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

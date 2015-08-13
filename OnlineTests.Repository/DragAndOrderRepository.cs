using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Helpers;
using OnlineTests.Common.Models;
using OnlineTests.Repository;
using OnlineTests.Repository.Model;

namespace OnlineTests.Common.Contracts.Repositories
{
    public class DragAndOrderRepository : BaseRepository, IDragAndOrderRepository
    {
        public void Create(DragAndOrder question)
        {
            var questionXml = DBNull.Value;

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, string.Empty, questionId);

            question.Id = (int)questionId.Value;

            foreach (var option in question.Options)
            {
                var columnXml = new DragAndOrder_OptionXmlModel
                {
                    Id = option.id,
                    Text = option.text,
                    Worth = option.worth
                };
                var columnXmlSerialized = Serializer.Serialize(columnXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", columnXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }

            public void Update(DragAndOrder question)
            {
                var questionXml = DBNull.Value;

                if (this.connection == null)
                {
                    this.connection = new ConnectionProvider();
                }

                this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, string.Empty);

                this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

                foreach (var option in question.Options)
                {
                    var columnXml = new DragAndOrder_OptionXmlModel
                    {
                        Id = option.id,
                        Text = option.text,
                        Worth = option.worth
                    };
                    var columnXmlSerialized = Serializer.Serialize(columnXml);
                    this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", columnXmlSerialized);
                }
                this.connection.Db.SaveChanges();
            }
        }
    }

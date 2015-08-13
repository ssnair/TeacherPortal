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
    public class SelectableChartRepository : BaseRepository, ISelectableChartRepository
    {
        public void Create(SelectableChart question)
        {
            var questionXml = DBNull.Value;

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, string.Empty, questionId);

            question.Id = (int)questionId.Value;

            foreach (var column in question.Columns)
            {
                var columnXml = new SelectableChart_ColumnXmlModel
                {
                    Id = column.id,
                    Label = column.label,
                    Selected = column.selected,
                    Value = column.value
                };
                var columnXmlSerialized = Serializer.Serialize(columnXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", columnXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }

        public void Update(SelectableChart question)
        {
            var questionXml = DBNull.Value;
            
            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, string.Empty);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            foreach (var column in question.Columns)
            {
                var columnXml = new SelectableChart_ColumnXmlModel
                {
                    Id = column.id,
                    Label = column.label,
                    Selected = column.selected,
                    Value = column.value
                };
                var columnXmlSerialized = Serializer.Serialize(columnXml);
                this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", columnXmlSerialized);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Helpers;
using OnlineTests.Common.Models;
using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Repository
{
    public class DivideAndSelectShapeRepository : BaseRepository, IDivideAndSelectShapeRepository
    {
        //private static byte _questionTypeId = 200;
        public void Create(DivideAndSelectShape question)
        {
            var questionXml = DBNull.Value;

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            var objSettings = question.GetSettings();
            var settings = Serializer.Serialize(objSettings);

            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, settings, questionId);

            question.Id = (int)questionId.Value;

            this.connection.Db.SaveChanges();
        }

        public void Update(DivideAndSelectShape question)
        {
            var questionXml = DBNull.Value;

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var objSettings = question.GetSettings();
            var settings = Serializer.Serialize(objSettings);

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, settings);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            this.connection.Db.SaveChanges();
        }
    }
}

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

namespace OnlineTests.Repository
{
    public class ShapesOverImageRepository : BaseRepository, IShapesOverImageRepository
    {
        //private static byte _questionTypeId = 220;
        public void Create(ShapesOverImage question)
        {
            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            var settings = Serializer.Serialize(question.GetSettings());

            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, settings, questionId);

            question.Id = (int)questionId.Value;

            this.connection.Db.SaveChanges();
        }

        public void Update(ShapesOverImage question)
        {
            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var settings = Serializer.Serialize(question.GetSettings());
            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, settings);
            this.connection.Db.SaveChanges();
        }
    }
}
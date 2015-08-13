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
    public class MultipleDragAndDropImageRepository : BaseRepository, IMultipleDragAndDropImageRepository
    {
        public void Create(MultipleDragAndDropImage question)
        {

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, null, questionId);

            question.Id = (int)questionId.Value;

            foreach (var answer in question.AnswersList)
            {
                this.connection.Db.Answers_Insert(question.Id, answer.imgName, answer.isCorrect, 0, 0, "", answer.imgURL);
            }

            this.connection.Db.SaveChanges();
        }

        public void Update(MultipleDragAndDropImage question)
        {
         
            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, null);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            foreach (var answer in question.AnswersList)
            {
                this.connection.Db.Answers_Insert(question.Id, answer.imgName, answer.isCorrect, 0, 0, "", answer.imgURL);
            }
            this.connection.Db.SaveChanges();
        }
    }
}

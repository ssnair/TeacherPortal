﻿using OnlineTests.Common.Contracts.Repositories;
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
    public class DrawPointsInAChartRepository : BaseRepository, IDrawPointsInAChartRepository
    {
        //private static byte _questionTypeId = 210;
        public void Create(DrawPointsInAChart question)
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

        public void Update(DrawPointsInAChart question)
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
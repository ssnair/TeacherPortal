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
    public class MovePointsInAChartRepository : BaseRepository, IMovePointsInAChartRepository
    {
        public void Create(MovePointsInAChart question) {
            var questionXml = new MovePointsInAChart_QuestionXmlModel
            {
                Domain = question.Domain,
                MajorScale = question.MajorScale,
                MinorScale = question.MinorScale,
                chartType = question.chartType
            };

            var questionXmlSerialized = Serializer.Serialize(questionXml);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            var questionId = new ObjectParameter("Questionid", typeof(int));
            this.connection.Db.Items_Insert(question.QuestionTypeId, question.QuestionText, question.Notes, questionXmlSerialized, questionId);

            question.Id = (int)questionId.Value;

             var centerSpotXml = new MovePointsInAChart_SpotXmlModel
            {
                SpotType = "center",
                X = question.CenterSpot.X,
                Y = question.CenterSpot.Y
            };

            var centerSpotXmlSerialized = Serializer.Serialize(centerSpotXml);
            this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", centerSpotXmlSerialized); 

             var minMaxSpotXml = new MovePointsInAChart_SpotXmlModel
            {
                SpotType = "minmax",
                X = question.MinMaxSpot.X,
                Y = question.MinMaxSpot.Y
            };

            var minMaxSpotXmlSerialized = Serializer.Serialize(minMaxSpotXml);
            this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", minMaxSpotXmlSerialized);
            this.connection.Db.SaveChanges();
        }

        public void Update(MovePointsInAChart question)
        {
            var questionXml = new MovePointsInAChart_QuestionXmlModel
            {
                Domain = question.Domain,
                MajorScale = question.MajorScale,
                MinorScale = question.MinorScale,
                chartType = question.chartType
            };

            var questionXmlSerialized = Serializer.Serialize(questionXml);

            if (this.connection == null)
            {
                this.connection = new ConnectionProvider();
            }

            this.connection.Db.Items_Update(question.Id, question.QuestionText, question.Notes, questionXmlSerialized);

            this.connection.Db.Answers_ByQuestionId_Delete(question.Id);

            var centerSpotXml = new MovePointsInAChart_SpotXmlModel
            {
                SpotType = "center",
                X = question.CenterSpot.X,
                Y = question.CenterSpot.Y
            };

            var centerSpotXmlSerialized = Serializer.Serialize(centerSpotXml);
            this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", centerSpotXmlSerialized);

            var minMaxSpotXml = new MovePointsInAChart_SpotXmlModel
            {
                SpotType = "minmax",
                X = question.MinMaxSpot.X,
                Y = question.MinMaxSpot.Y
            };

            var minMaxSpotXmlSerialized = Serializer.Serialize(minMaxSpotXml);
            this.connection.Db.Answers_Insert(question.Id, "", null, 0, 0, "", minMaxSpotXmlSerialized);
            this.connection.Db.SaveChanges();
        }
    }
}

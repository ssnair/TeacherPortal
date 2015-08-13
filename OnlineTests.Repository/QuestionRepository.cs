using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Repository
{
    public class QuestionRepository : BaseRepository, IQuestionRepository
    {
        public AnswerRepository AnswerRepository { get; set; }

        public QuestionRepository(AnswerRepository answerRepository)
        {
            this.AnswerRepository = answerRepository;

        }
        
        public void Create(Question question)
        {
            throw new NotImplementedException();
        }

        private static string Serialize(object source)
        {
            string xml;

            var serializer = new DataContractSerializer(source.GetType());

            using (var backing = new System.IO.StringWriter())
            {
                using (var writer = new System.Xml.XmlTextWriter(backing))
                {
                    serializer.WriteObject(writer, source);
                    xml = backing.ToString();
                }
            }
            return xml;
        }

        public IEnumerable<Question> GetAll()
        {
            using (var db = new EntitiesContainer())
            {
                return db.Items_Select().ToList()
                    .Select(x => new Question 
                    { 
                        ApproveDate = x.ApproveDate,
                        ApproveUser = x.ApproveUser,
                        Complexity = x.Complexity,
                        Components = null,
                        CourseId = x.courseID,
                        CreateDate = x.CreateDate,
                        CreateUserId = x.CreateUserID,
                        Difficulty = x.Difficulty,
                        ExtendedDetails = x.ExtendedDetails,
                        GradeLevel = x.GradeLevel,
                        Id = x.questionID,
                        IdFromOldOT = x.QuestionID_FromOldOT,
                        MasterQuestionId = x.masterQuestionID,
                        MaxScore = x.maxScore,
                        MinScore = x.minScore,
                        ModifyDate = x.ModifyDate,
                        ModifyUserId = x.ModifyUserID,
                        Notes = x.Notes,
                        PassageId = x.passageID,
                        PassageIdFromOldOT = x.PassageID_FromOldOT,
                        QuestionText = x.questionText,
                        QuestionTypeId = x.QuestionTypeID,
                        StatusId = x.statusID,
                        SubjectId = x.SubjectID,
                        Targ = x.targ
                    }).ToList();
            }
        }

        public Question Get(int id)
        {
            using (var db = new EntitiesContainer())
            {
                var result = db.Items_ById_Select(id).FirstOrDefault();
                if (result!= null) {
                    var question = new Question
                    {
                        ApproveDate = result.ApproveDate,
                        ApproveUser = result.ApproveUser,
                        Complexity = result.Complexity,
                        Components = null,
                        CourseId = result.courseID,
                        CreateDate = result.CreateDate,
                        CreateUserId = result.CreateUserID,
                        Difficulty = result.Difficulty,
                        ExtendedDetails = result.ExtendedDetails,
                        GradeLevel = result.GradeLevel,
                        Id = result.questionID,
                        IdFromOldOT = result.QuestionID_FromOldOT,
                        MasterQuestionId = result.masterQuestionID,
                        MaxScore = result.maxScore,
                        MinScore = result.minScore,
                        ModifyDate = result.ModifyDate,
                        ModifyUserId = result.ModifyUserID,
                        Notes = result.Notes,
                        PassageId = result.passageID,
                        PassageIdFromOldOT = result.PassageID_FromOldOT,
                        QuestionText = result.questionText,
                        QuestionTypeId = result.QuestionTypeID,
                        StatusId = result.statusID,
                        SubjectId = result.SubjectID,
                        Targ = result.targ
                    };

                    question.Answers = AnswerRepository.GetByQuestionId(question.Id).ToList();
                    return question;
                }
            }
            return null;
        }

        public void Update(Question question)
        {
            throw new NotImplementedException();
        }
    }
}

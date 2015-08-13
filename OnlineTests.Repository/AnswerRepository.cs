using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;
using OnlineTests.Repository.Model;

namespace OnlineTests.Repository
{
    public class AnswerRepository : BaseRepository, IAnswerRepository
    {

        public IEnumerable<Answer> GetByQuestionId(int questionId)
        {
            using (var db = new EntitiesContainer())
            {
                var result = db.Answers_ByQuestionId_Select(questionId).ToList();
                if (result != null)
                {
                    return result.Select(x => new Answer
                        {
                            AnsVal = x.ansVal,
                            ExendedDetails = x.ExtendedDetails,
                            Id = x.ID,
                            IdFromOldOT = x.id_FromOldOT,
                            IsImage = x.isImage,
                            ModifyBy = x.modifyBy,
                            ModifyDate = x.modifyDate,
                            Notes = x.Notes,
                            OrdinalPos = x.ordinalPos,
                            QID = x.QID,
                            QuesdtionID_FromOldOT = x.questionID_FromOldOT,
                            Txt = x.txt,
                            Worth = x.worth
                        });
                }
                return null;
            }
           
        }
    }
}

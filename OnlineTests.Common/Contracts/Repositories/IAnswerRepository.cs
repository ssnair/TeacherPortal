using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IAnswerRepository
    {
        IEnumerable<Answer> GetByQuestionId(int questionId);
    }
}

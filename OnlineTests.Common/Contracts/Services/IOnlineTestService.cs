using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IOnlineTestService
    {
        IOnlineTestRepository OnlineTestRepository { get; }
        IQuestionRepository QuestionRepository { get; }

        IEnumerable<OnlineTest> GetAll();

        bool Save(OnlineTest onlineTest);
    }
}

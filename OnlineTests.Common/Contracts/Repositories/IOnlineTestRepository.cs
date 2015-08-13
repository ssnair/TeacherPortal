using System.Collections;
using System.Collections.Generic;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IOnlineTestRepository
    {
        IEnumerable<OnlineTest> GetAll();

        bool Save(OnlineTest onlineTest);
    }
}

using System.Collections.Generic;
using System.Linq;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class OnlineTestRepository : IOnlineTestRepository
    {
        private static readonly List<OnlineTest> Data = new List<OnlineTest>()
        {
            new OnlineTest(),
            new OnlineTest(),
            new OnlineTest(),
            new OnlineTest(),
            new OnlineTest()
        };

        public IEnumerable<OnlineTest> GetAll()
        {
            return Data.OrderBy(x => x.Name);

        }


        public bool Save(OnlineTest onlineTest)
        {
            Data.Add(onlineTest);
            return true;
        }
    }
}

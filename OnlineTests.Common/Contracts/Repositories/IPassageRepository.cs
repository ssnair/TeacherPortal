using System.Collections.Generic;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IPassageRepository
    {
        IEnumerable<Passage> GetAll();
    }
}

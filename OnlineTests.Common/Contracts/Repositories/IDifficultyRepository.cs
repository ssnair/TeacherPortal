using System.Collections.Generic;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IDifficultyRepository
    {
        IEnumerable<Difficulty> GetAll();
    }
}

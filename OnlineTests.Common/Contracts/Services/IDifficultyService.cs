using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IDifficultyService
    {
        IDifficultyRepository DifficultyRepository { get; }
        IEnumerable<Difficulty> GetAll();
    }
}

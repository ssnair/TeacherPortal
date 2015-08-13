using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IPassageService
    {
        IPassageRepository PassageRepository { get; }
        IEnumerable<Passage> GetAll();
    }
}

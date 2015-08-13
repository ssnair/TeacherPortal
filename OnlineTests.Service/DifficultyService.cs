using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{
    public class DifficultyService : IDifficultyService
    {

        public IDifficultyRepository DifficultyRepository { get; private set; }

        public DifficultyService(IDifficultyRepository difficultyRepository)
        {
            DifficultyRepository = difficultyRepository;
        }

        public IEnumerable<Difficulty> GetAll()
        {
            return DifficultyRepository.GetAll();
        }

    }
}

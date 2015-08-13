using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class DifficultyRepository : IDifficultyRepository
    {
        public IEnumerable<Difficulty> GetAll()
        {
            return new List<Difficulty>
            {
                new Difficulty
                {
                    Id = 1,
                    Code = "D1",
                    Name = "Really Easy",
                    Ordinal = 1
                },
                new Difficulty
                {
                    Id = 2,
                    Code = "D2",
                    Name = "Normal",
                    Ordinal = 2
                },
                new Difficulty
                {
                    Id = 3,
                    Code = "D3",
                    Name = "Don't try",
                    Ordinal = 3
                }
            };
        }
    }
}

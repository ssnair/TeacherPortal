using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class ComplexityRepository : IComplexityRepository
    {
        public IEnumerable<Complexity> GetAll()
        {
            return new List<Complexity>
            {
                new Complexity{Id = 1, Code = "A", Name ="Easy", Ordinal = 1},
                new Complexity{Id = 2, Code = "B", Name ="Average", Ordinal = 2},
                new Complexity{Id = 3, Code = "C", Name ="Dificult", Ordinal = 3}
            };
        }
    }
}

using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class PassageRepository : IPassageRepository
    {
        public IEnumerable<Passage> GetAll()
        {
            return new List<Passage>
            {
                new Passage
                {
                    Id = 1,
                    Text = "Passage 1"
                },
                new Passage
                {
                    Id = 2,
                    Text = "Passage 2"
                },
                new Passage
                {
                    Id = 3,
                    Text = "Passage 3"
                }

            };
        }
    }
}

using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class SubjectRepository : ISubjectRepository
    {
        public IEnumerable<Common.Models.Subject> GetAll()
        {
            return new List<Subject>
            {
                new Subject
                {
                    Id = 1,
                    Abbr = "Sub1",
                    Name = "An interesting Subjet",
                    StandardCode = "S1"
                },
                new Subject
                {
                    Id = 2,
                    Abbr = "Sub2",
                    Name = "Another interesting Subjet",
                    StandardCode = "S2"
                },
                new Subject
                {
                    Id = 3,
                    Abbr = "Sub3",
                    Name = "An extraordinary Subjet",
                    StandardCode = "S3"
                }
            };
        }
    }
}

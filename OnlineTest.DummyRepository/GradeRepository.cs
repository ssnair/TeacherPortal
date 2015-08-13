using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.DummyRepository
{
    public class GradeRepository : IGradeRepository
    {
        public IEnumerable<Common.Models.Grade> GetAll()
        {
            return new List<Grade>
            {
                new Grade
                {
                    Id = 1,
                    Name= "1st Grade"
                },
                new Grade
                {
                    Id = 2,
                    Name= "2nd Grade"
                },
                new Grade
                {
                    Id = 3,
                    Name= "3rd Grade"
                }
            };
        }
    }
}

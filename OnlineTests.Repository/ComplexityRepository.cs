using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;
using OnlineTests.DummyRepository;

namespace OnlineTests.Repository
{
    public class ComplexityRepository : IComplexityRepository
    {   
        public IEnumerable<Common.Models.Complexity> GetAll()
        {
            using (var context = new OnlineTestsContext())
            {
                var result = context.Database.SqlQuery<Repository.Model.Complexity>("Complexity_Select", new object[] { });
                return result.Select(x => new Common.Models.Complexity
                {
                    Id = x.Id,
                    Name = x.Name,
                    Ordinal = x.Ordinal,
                    Code = x.Code
                }).ToList();
            }
        }
    }
}

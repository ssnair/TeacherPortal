using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{
    public class GradeService : IGradeService
    {
        public IGradeRepository GradeRepository { get; private set; }

        public GradeService(IGradeRepository gradeRepository)
        {
            this.GradeRepository = gradeRepository;
        }

        public IEnumerable<Grade> GetAll()
        {
            return GradeRepository.GetAll();
        }
    }
}

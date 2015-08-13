using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IGradeService
    {
        IGradeRepository GradeRepository { get; }
        IEnumerable<Grade> GetAll();
    }
}

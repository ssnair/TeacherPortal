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
    public class ComplexityService : IComplexityService
    {
        public IComplexityRepository ComplexityRepository { get; private set; }

        public ComplexityService(IComplexityRepository complexityRepository)
        {
            this.ComplexityRepository = complexityRepository;
        }

        public IEnumerable<Complexity> GetAll()
        {
            return ComplexityRepository.GetAll();
        }

    }
}

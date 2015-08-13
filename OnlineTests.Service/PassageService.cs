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
    public class PassageService : IPassageService
    {
        public IPassageRepository PassageRepository { get; private set; }

        public PassageService(IPassageRepository passageRepository)
        {
            this.PassageRepository = passageRepository;
        }

        public IEnumerable<Passage> GetAll()
        {
            return PassageRepository.GetAll();
        }

    }
}

using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{
    public class SubjectService : ISubjectService
    {
        public ISubjectRepository SubjectRepository { get; private set; }

        public SubjectService(ISubjectRepository subjectRepository)
        {
            this.SubjectRepository = subjectRepository;
        }

        public IEnumerable<Subject> GetAll()
        {
            return SubjectRepository.GetAll();
        }
    }
}

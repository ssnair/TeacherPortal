using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{
    public class OnlineTestService : IOnlineTestService
    {
        public IOnlineTestRepository OnlineTestRepository { get; private set; }
        public IQuestionRepository QuestionRepository { get; private set; }
         
        public OnlineTestService(IOnlineTestRepository onlineTestRepository, IQuestionRepository questionRepository)
        {
            this.OnlineTestRepository = onlineTestRepository;
            this.QuestionRepository = questionRepository;
        }

        public IEnumerable<OnlineTest> GetAll()
        {
            return OnlineTestRepository.GetAll();
        }

        public bool Save(OnlineTest onlineTest)
        {
            OnlineTestRepository.Save(onlineTest);

            foreach (var question in onlineTest.Questions)
            {
                QuestionRepository.Create(question);
            }
            return true;
        }
    }
}

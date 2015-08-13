using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;
using System.Linq;
using System;

namespace OnlineTests.DummyRepository
{
    public class QuestionRepository : IQuestionRepository
    {
        private static readonly List<Question> data = new List<Question>
        {
            new Question{Id = 1},
            new Question{Id = 2},
            new Question{Id = 3},
            new Question{Id = 4}
        };

        public void Create(Question question)
        {
            data.Add(question);
            question.Id = data.OrderByDescending(x => x.Id).FirstOrDefault().Id + 1;
        }

        public void Update(Question question)
        {
            throw new NotImplementedException();

        }


        public IEnumerable<Question> GetAll()
        {
            throw new System.NotImplementedException();
        }


        public Question Get(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}

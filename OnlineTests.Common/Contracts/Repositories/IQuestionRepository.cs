using System.Collections.Generic;
using OnlineTests.Common.Models;
namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IQuestionRepository
    {
        void Create(Question question);
        void Update(Question question);

        IEnumerable<Question> GetAll();
        Question Get(int id);
    }
}

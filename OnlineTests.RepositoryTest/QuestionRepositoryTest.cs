using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OnlineTests.Common.Models;
using OnlineTests.Repository;

namespace OnlineTests.RepositoryTest
{
    [TestFixture]
    public class QuestionRepositoryTest
    {
        [Test]
        public void ShouldSaveQuestion()
        {
            var repository = new QuestionRepository(new AnswerRepository());
            var question = new Question { 
                QuestionTypeId = 1,
                QuestionText = "foo",
                Notes = "bar",
                Components = new List<IQuestionComponent>()
            };
            //var result = repository.Update(question);
            //Assert.Greater(result.Id, 0);
        }
    }
}

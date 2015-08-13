using System.Collections.Generic;
using System.Reflection;
using Moq;
using Ninject;
using NUnit.Framework;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;
using OnlineTests.DummyRepository;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Service;

namespace OnlineTests.BackendTest
{
    [TestFixture]
    public class QuestionServiceTest
    {
        [Test]
        public void QuestionServiceShouldBeInitializedByDI()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            var questionService = kernel.Get<IQuestionService>();

            Assert.IsInstanceOf<QuestionService>(questionService);
            Assert.IsInstanceOf<QuestionRepository>(questionService.QuestionRepository);
        }

        [Test]
        public void SubjectServiceShouldBeInitializedByDI()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            var questionService = kernel.Get<IQuestionService>();

            Assert.IsInstanceOf<QuestionService>(questionService);
            Assert.IsInstanceOf<SubjectService>(questionService.SubjectService);
        }

    }
}

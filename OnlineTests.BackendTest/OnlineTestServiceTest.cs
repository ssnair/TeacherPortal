using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Moq;
using Ninject;
using NUnit.Framework;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;
using OnlineTests.DummyRepository;
using OnlineTests.Service;


namespace OnlineTests.BackendTest
{
    [TestFixture]
    public class OnlineTestServiceTest
    {
        private IOnlineTestService OnlineTestService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            OnlineTestService = kernel.Get<IOnlineTestService>();
        }

        [Test]
        public void OnlineTestRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<OnlineTestService>(OnlineTestService);
            Assert.IsInstanceOf<OnlineTestRepository>(OnlineTestService.OnlineTestRepository);
        }

        [Test]
        public void QuestionRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<OnlineTestService>(OnlineTestService);
            Assert.IsInstanceOf<QuestionRepository>(OnlineTestService.QuestionRepository);
        }

        [Test]
        public void ShouldReturnAllItems()
        {
            var result = OnlineTestService.GetAll();
            
            Assert.IsNotNull(result);
            Assert.AreEqual(5, result.Count());
        }

        [Test]
        public void ShouldAddANewItem()
        {
            var onlineTestRepository =  new Mock<IOnlineTestRepository>();

            onlineTestRepository.Setup(x => x.Save(It.IsAny<OnlineTest>()))
                .Returns(true).Verifiable();

            var questionRepository = new Mock<IQuestionRepository>();

            questionRepository.Setup(x => x.Update(It.IsAny<Question>()));
              //  .Returns(new Question()).Verifiable();

            var service = new OnlineTestService(onlineTestRepository.Object, questionRepository.Object);
            bool res = service.Save(new OnlineTest
            {
                Questions = new List<Question>
                {
                    new Question(),
                    new Question(),
                    new Question()
                }
            });

            onlineTestRepository.Verify(x => x.Save(It.IsAny<OnlineTest>()), Times.Once());
            questionRepository.Verify(x => x.Update(It.IsAny<Question>()), Times.Exactly(3));

        }




    }
}

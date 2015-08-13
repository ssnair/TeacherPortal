using System.Collections.Generic;
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
    public class PassageServiceTest
    {
        private IPassageService PassageService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            PassageService = kernel.Get<IPassageService>();
        }

        [Test]
        public void PassageRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<PassageService>(PassageService);
            Assert.IsInstanceOf<PassageRepository>(PassageService.PassageRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository =  new Mock<IPassageRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<Passage>())
                .Verifiable();

            var service = new PassageService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

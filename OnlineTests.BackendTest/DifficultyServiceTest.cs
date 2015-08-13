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
    public class DifficultyServiceTest
    {
        private IDifficultyService DifficultyService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            DifficultyService = kernel.Get<IDifficultyService>();
        }

        [Test]
        public void DifficultyRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<DifficultyService>(DifficultyService);
            Assert.IsInstanceOf<DifficultyRepository>(DifficultyService.DifficultyRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository = new Mock<IDifficultyRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<Difficulty>())
                .Verifiable();

            var service = new DifficultyService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

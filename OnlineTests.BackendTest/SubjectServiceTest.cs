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
    public class SubjectServiceTest
    {
        private ISubjectService SubjectService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            SubjectService = kernel.Get<ISubjectService>();
        }

        [Test]
        public void SubjectRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<SubjectService>(SubjectService);
            Assert.IsInstanceOf<SubjectRepository>(SubjectService.SubjectRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository =  new Mock<ISubjectRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<Subject>())
                .Verifiable();

            var service = new SubjectService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

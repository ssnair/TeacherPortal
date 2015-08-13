using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
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
    public class GradeServiceTest
    {
        private IGradeService GradeService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            GradeService = kernel.Get<IGradeService>();
        }

        [Test]
        public void GradeRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<GradeService>(GradeService);
            Assert.IsInstanceOf<GradeRepository>(GradeService.GradeRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository =  new Mock<IGradeRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<Grade>())
                .Verifiable();

            var service = new GradeService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

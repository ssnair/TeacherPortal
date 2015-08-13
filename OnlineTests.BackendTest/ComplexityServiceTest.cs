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
    public class ComplexityServiceTest
    {
        private IComplexityService ComplexityService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            ComplexityService = kernel.Get<IComplexityService>();
        }

        [Test]
        public void ComplexityRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<ComplexityService>(ComplexityService);
            Assert.IsInstanceOf<ComplexityRepository>(ComplexityService.ComplexityRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository =  new Mock<IComplexityRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<Complexity>())
                .Verifiable();

            var service = new ComplexityService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

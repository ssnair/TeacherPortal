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
    public class ItemTypeServiceTest
    {
        private IItemTypeService ItemTypeService;

        [SetUp]
        public void Setup()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            ItemTypeService = kernel.Get<IItemTypeService>();
        }

        [Test]
        public void ItemTypeRepositoryShouldBeInitializedByDI()
        {
            Assert.IsInstanceOf<ItemTypeService>(ItemTypeService);
            Assert.IsInstanceOf<ItemTypeRepository>(ItemTypeService.ItemTypeRepository);
        }

        [Test]
        public void GetAll_ShouldCallRepository()
        {
            var repository =  new Mock<IItemTypeRepository>();

            repository.Setup(x => x.GetAll())
                .Returns(new List<ItemType>())
                .Verifiable();

            var service = new ItemTypeService(repository.Object);
            var result = service.GetAll();

            Assert.IsNotNull(result);
            repository.Verify(x => x.GetAll(), Times.Once);
        }
    }
}

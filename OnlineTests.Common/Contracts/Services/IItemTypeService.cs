using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IItemTypeService
    {
        IItemTypeRepository ItemTypeRepository { get; }
        IEnumerable<ItemType> GetAll();
    }
}

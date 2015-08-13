using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;

namespace OnlineTests.DummyRepository
{
    public class ItemTypeRepository : IItemTypeRepository
    {
        public IEnumerable<Common.Models.ItemType> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}

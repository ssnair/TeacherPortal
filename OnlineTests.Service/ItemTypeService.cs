using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{
    public class ItemTypeService : IItemTypeService
    {
        public IItemTypeRepository ItemTypeRepository { get; private set; }

        public ItemTypeService(IItemTypeRepository itemTypeRepository)
        {
            ItemTypeRepository = itemTypeRepository;
        }

        public IEnumerable<ItemType> GetAll()
        {
            return ItemTypeRepository.GetAll();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OnlineTests.Common.Models;
using OnlineTests.Repository;

namespace OnlineTests.RepositoryTest
{
    [TestFixture]
    public class TransactionManagerTest
    {
        [Test]
        public void ShouldCreateConnection() {
            var connection = ConnectionProvider.Get();
            Assert.IsNotNull(connection);
        }

        [Test]
        public void ShouldIntegrateWithRepositories() 
        {
            //var connection = ConnectionProvider.Get();
            //var repo = new QuestionRepository(connection);
            //repo.Save(new Question());
            //connection.SaveChanges();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Repository
{
    public class ConnectionProvider
    {

        private readonly EntitiesContainer connection;

        public ConnectionProvider()
        {
            this.connection = new EntitiesContainer(); 
        }

        public static ConnectionProvider Get() 
        {
            var instance = new ConnectionProvider();
            return instance;
        }

        public EntitiesContainer Db {
            get { return connection; }
        }

        public void SaveChanges() 
        {
            this.connection.SaveChanges();
        }
    }
}

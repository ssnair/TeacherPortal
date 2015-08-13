using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Repository
{
    public abstract class BaseRepository
    {
        protected ConnectionProvider connection;

        public BaseRepository()
        {

        }

        public BaseRepository(ConnectionProvider connection)
        {
            this.connection = connection;

        }
    }
}

using System.Data.Entity;
using OnlineTests.Repository.Model;

namespace OnlineTests.Repository
{
    public class OnlineTestsContext  : DbContext
    {
        public OnlineTestsContext()
            : base("DefaultConnection")
        {
            
        }
        public DbSet<Complexity> Complexities { get; set; }
    }
}

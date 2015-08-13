using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Common.Models
{
    public class Difficulty
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int Ordinal { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Repository.Model
{
    public abstract class BaseAnswer
    {
        public int Id { get; set; }
        public string Txt { get; set; }
        public int? AnsVal { get; set; }
        public int? Worth { get; set; }
        public int? OrdinalPos { get; set; }
        public string Notes { get; set; }
    }

    public class MovePointsInAChartAnswer : BaseAnswer
    { 
    
    }
}

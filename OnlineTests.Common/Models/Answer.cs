using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Common.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int? IdFromOldOT { get; set; }
        public int? QID { get; set; }
        public int? QuesdtionID_FromOldOT { get; set; }
        public string Txt { get; set; }
        public int? AnsVal { get; set; }
        public int? Worth { get; set; }
        public int? OrdinalPos { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public bool? IsImage { get; set; }
        public string Notes { get; set; }
        public string ExendedDetails { get; set; }
    }
}

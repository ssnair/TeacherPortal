using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Common.Models
{
    public interface IQuestionComponent
    {
        int? Id { get; set; }
        string Contents { get; set; }
        int Order { get; set; }
        Type ComponentType { get; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineTests.Web.Models
{
    public enum ComponentType
    {
        CkEditor = 1,
        DragAndOrder,
        MultipleDrag,
        MovePopintsInAGraph,
        MovePointsInALine,
        SelectSectionsOfAGraph
    };

    public interface IQuestionComponentModel
    {
        int? Id { get; set; }
        int Order { get; set; }
        int ComponentType { get; set; }
        string Contents { get; set; }
    }
}
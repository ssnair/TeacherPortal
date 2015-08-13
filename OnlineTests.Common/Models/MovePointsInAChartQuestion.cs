using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Common.Models
{
    public class MovePointsInAChartQuestion : Question
    {
        public int Domain { get; set; }
        public decimal MajorScale { get; set; }
        public decimal MinorScale { get; set; }

        public Spot CenterSpot { get; set; }
        public Spot MinMaxSpot { get; set; }
    }

    public class Spot
    {
        public decimal X { get; set; }
        public decimal Y { get; set; }
    }
}

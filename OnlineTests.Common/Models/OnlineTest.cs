using System.Collections.Generic;

namespace OnlineTests.Common.Models
{
    public class OnlineTest
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<Question> Questions;
    }
}

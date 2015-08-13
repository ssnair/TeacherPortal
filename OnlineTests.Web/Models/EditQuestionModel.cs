using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineTests.Web.Models
{
    public class EditQuestionModel
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public int QuestionTypeId { get; set; }
        public string Notes { get; set; }
        public int Worth { get; set; }

        public string Settings { get; set; }

    }
}
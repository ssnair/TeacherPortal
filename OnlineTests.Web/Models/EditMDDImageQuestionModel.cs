using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OnlineTests.Common.Models;

namespace OnlineTests.Web.Models
{
    public class EditMDDImageQuestionModel
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public int QuestionTypeId { get; set; }
        public string Notes { get; set; }
        public int Worth { get; set; }

        public MultipleDragAndDropImage_Answer[] AnswersList { get; set; }
    }
}
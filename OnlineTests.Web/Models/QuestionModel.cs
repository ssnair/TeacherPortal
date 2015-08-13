using System;
using System.Collections.Generic;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;
using System.Runtime.Serialization;
using System.Web.Mvc;

namespace OnlineTests.Web.Models
{
    [DataContract]
    public class QuestionModel
    {
        [DataMember(Name = "id")]
        public int? Id { get; set; }
        [DataMember(Name = "subjectId")]
        public short? SubjectId { get; set; }
        [DataMember(Name = "gradeLevel")]
        public string GradeLevel { get; set; }
        [DataMember(Name = "questionTypeId")]
        public short QuestionTypeId { get; set; }
        [AllowHtml]
        [DataMember(Name = "questionText")]
        public string QuestionText { get; set; }
        [DataMember(Name = "passageId")]
        public int? PassageId { get; set; }
        [DataMember(Name = "complexity")]
        public string Complexity { get; set; }
        [DataMember(Name = "difficulty")]
        public string Difficulty { get; set; }
        [DataMember(Name = "userId")]
        public int? UserId { get; set; }
        [DataMember(Name = "minScore")]
        public short? MinScore { get; set; }
        [DataMember(Name = "maxScore")]
        public short? MaxScore { get; set; }
        [DataMember(Name = "targ")]
        public short? Targ { get; set; }
        [DataMember(Name = "courseId")]
        public string CourseId { get; set; }
        [DataMember(Name = "notes")]
        public string Notes { get; set; }
        [DataMember(Name = "statusId")]
        public short StatusId { get; set; }
        [DataMember(Name = "approveUser")]
        public int? ApproveUser { get; set; }
    }
}

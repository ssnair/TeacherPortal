using System;

namespace OnlineTests.Common.Models
{
    public class Passage
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int PassageIDFromOldOT { get; set; }
        public string Text { get; set; }
        public bool IsImage { get; set; }
        public short Ordinal { get; set; }
        public short SubjectId { get; set; }
        public string GradeLevel { get; set; }
        public short ItemTypeId { get; set; }
        public short SourceId { get; set; }
        public bool Revised { get; set; }
        public short StatusId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public short? GenreId { get; set; }
        public short? ReadilibilityId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
    }
}

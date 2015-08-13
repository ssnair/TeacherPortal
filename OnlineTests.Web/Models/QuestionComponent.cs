using System.Runtime.Serialization;

namespace OnlineTests.Web.Models
{
    public class CkEditorContent : IQuestionComponentModel
    {
        [DataMember(Name = "id")]
        public int? Id { get; set; }
        [DataMember(Name = "order")]
        public int Order { get; set; }
        [DataMember(Name = "componentType")]
        public int ComponentType { get; set; }
        [DataMember(Name = "contents")]
        public string Contents { get; set; }
    }

    public class DragAndOrderContent : IQuestionComponentModel
    {
        [DataMember(Name = "id")]
        public int? Id { get; set; }
        [DataMember(Name = "order")]
        public int Order { get; set; }
        [DataMember(Name = "contents")]
        public string Contents { get; set; }
        [DataMember(Name = "componentType")]
        public int ComponentType { get; set; }

        [DataMember(Name = "items")]
        public DragAndOrderItemModel[] Items { get; set; }
    }

    public class DragAndOrderItemModel
    {
        [DataMember(Name = "id")]
        public int? Id { get; set; }
        [DataMember(Name = "order")]
        public int Order { get; set; }
        [DataMember(Name = "label")]
        public string Label { get; set; }
    }

    public class MovePointsInAChartContent : IQuestionComponentModel
    {
        [DataMember(Name = "id")]
        public int? Id { get; set; }

        [DataMember(Name = "order")]
        public int Order { get; set; }
        
        [DataMember(Name = "contents")]
        public string Contents { get; set; }

        [DataMember(Name = "componentType")]
        public int ComponentType { get; set; }

        [DataMember(Name = "domain")]
        public decimal Domain { get; set; }

        [DataMember(Name = "majorScale")]
        public decimal MajorScale { get; set; }

        [DataMember(Name = "minorScale")]
        public decimal MinorScale { get; set; }

        [DataMember(Name = "centerSpot")]
        public SpotContent CenterSpot { get; set; }

        [DataMember(Name = "minMaxSpot")]
        public SpotContent MinMaxSpot { get; set; }
    }

    public class SpotContent
    {
        [DataMember(Name = "x")]
        public decimal X { get; set; }

        [DataMember(Name = "y")]
        public decimal Y { get; set; }
    }
}
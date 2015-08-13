using System.Collections.Generic;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Services
{
    public interface IQuestionService
    {
        IQuestionRepository QuestionRepository { get; }
        ISubjectService SubjectService { get; }
        IGradeService GradeService { get; }
        IComplexityService ComplexityService { get; }
        IDifficultyService DifficultyService { get; }
        IPassageService PassageService { get; }

        void Save(MovePointsInAChart question);
        void Save(MovePointsInALine question);
        void Save(SelectableChart question);
        void Save(MultipleDragAndDrop question);
        void Save(DragAndOrder question);
        void Save(MultipleDragAndDropImage question);
        void Save(MultipleDragAndDropJustification question);
        void Save(DrawLinesInAChart question);
        void Save(MultipleDragAndDropExpression question);
        void Save(InteractiveChart question);
        void Save(DivideAndSelectShape question);
        void Save(DrawPointsInAChart question);
        void Save(MultipleDragAndDrop2 question);
        void Save(ShapesOverImage question);
        void Save(MultipleDragAndDrop3 question);

        IEnumerable<Question> GetAll();
        Question Get(int id);
    }
}

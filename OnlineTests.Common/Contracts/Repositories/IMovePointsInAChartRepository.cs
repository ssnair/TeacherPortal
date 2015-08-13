using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineTests.Common.Models;

namespace OnlineTests.Common.Contracts.Repositories
{
    public interface IMovePointsInAChartRepository
    {
        void Create(MovePointsInAChart question);
        void Update(MovePointsInAChart question);
    }

    public interface IMovePointsInALineRepository
    {
        void Create(MovePointsInALine question);
        void Update(MovePointsInALine question);
    }

    public interface ISelectableChartRepository
    {
        void Create(SelectableChart question);
        void Update(SelectableChart question);
    }

    public interface IMultipleDragAndDropRepository
    {
        void Create(MultipleDragAndDrop question);
        void Update(MultipleDragAndDrop question);
    }

    public interface IDragAndOrderRepository
    {
        void Create(DragAndOrder question);
        void Update(DragAndOrder question);
    }

    public interface IMultipleDragAndDropImageRepository
    {
        void Create(MultipleDragAndDropImage question);
        void Update(MultipleDragAndDropImage question);
    }

    public interface IMultipleDragAndDropJustificationRepository
    {
        void Create(MultipleDragAndDropJustification question);
        void Update(MultipleDragAndDropJustification question);
    }

    public interface IDrawLinesInAChartRepository
    {
        void Create(DrawLinesInAChart question);
        void Update(DrawLinesInAChart question);
    }

    public interface IMultipleDragAndDropExpressionRepository
    {
        void Create(MultipleDragAndDropExpression question);
        void Update(MultipleDragAndDropExpression question);
    }

    public interface IInteractiveChartRepository
    {
        void Create(InteractiveChart question);
        void Update(InteractiveChart question);
    }

    public interface IDivideAndSelectShapeRepository
    {
        void Create(DivideAndSelectShape question);
        void Update(DivideAndSelectShape question);
    }

    public interface IDrawPointsInAChartRepository
    {
        void Create(DrawPointsInAChart question);
        void Update(DrawPointsInAChart question);
    }

    public interface IMultipleDragAndDrop2Repository
    {
        void Create(MultipleDragAndDrop2 question);
        void Update(MultipleDragAndDrop2 question);
    }

    public interface IShapesOverImageRepository
    {
        void Create(ShapesOverImage question);
        void Update(ShapesOverImage question);
    }

    public interface IMultipleDragAndDrop3Repository
    {
        void Create(MultipleDragAndDrop3 question);
        void Update(MultipleDragAndDrop3 question);
    }

} // end namespace

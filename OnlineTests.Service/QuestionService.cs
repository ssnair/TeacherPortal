using System.Collections.Generic;
using System.Linq;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Helpers;
using OnlineTests.Common.Models;

namespace OnlineTests.Service
{  
    public class QuestionService : IQuestionService
    {
        public IQuestionRepository QuestionRepository { get; private set; }
        public IAnswerRepository AnswerRepository { get; private set; }
        public IMovePointsInAChartRepository MovePointsInAChartRepository { get; private set; }
        public IMovePointsInALineRepository MovePointsInALineRepository { get; private set; }
        public ISelectableChartRepository SelectableChartRepository { get; private set; }
        public IMultipleDragAndDropRepository MultipleDragAndDropRepository { get; private set; }
        public IDragAndOrderRepository DragAndOrderRepository { get; private set; }
        public IMultipleDragAndDropImageRepository MultipleDragAndDropImageRepository { get; private set; }
        public IMultipleDragAndDropJustificationRepository MultipleDragAndDropJustificationRepository { get; private set; }
        public IDrawLinesInAChartRepository DrawLinesInAChartRepository { get; private set; }
        public IInteractiveChartRepository InteractiveChartRepository { get; private set; }
        public IDivideAndSelectShapeRepository DivideAndSelectShapeRepository { get; private set; }
        public IDrawPointsInAChartRepository DrawPointsInAChartRepository { get; private set; }
        public IShapesOverImageRepository ShapesOverImageRepository { get; private set; }
        public IMultipleDragAndDrop3Repository MultipleDragAndDrop3Repository { get; private set; }

        public ISubjectService SubjectService { get; private set; }
        public IGradeService GradeService { get; private set; }
        public IComplexityService ComplexityService { get; private set; }
        public IDifficultyService DifficultyService { get; private set; }
        public IPassageService PassageService { get; private set; }

        public IMultipleDragAndDropExpressionRepository MultipleDragAndDropExpressionRepository { get; private set; }
        public IMultipleDragAndDrop2Repository MultipleDragAndDrop2Repository { get; private set; }

        public QuestionService()
        {
        }

        public QuestionService(IMovePointsInAChartRepository movePointsInAChartRepository, 
            IMovePointsInALineRepository movePointsInALineRepository,
            ISelectableChartRepository selectableChartRepository,
            IMultipleDragAndDropRepository multipleDragAndDropRepository,
            IDragAndOrderRepository dragAndOrderRepository,
            IQuestionRepository questionRepository, 
            IAnswerRepository answerRepository,
            IMultipleDragAndDropImageRepository multipleDragAndDropImageRepository,
            IMultipleDragAndDropJustificationRepository multipleDragAndDropJustificationRepository,
            IDrawLinesInAChartRepository drawLinesInAChartRepository,
            IMultipleDragAndDropExpressionRepository multipleDragAndDropExpressionRepository,
            IInteractiveChartRepository interactiveChartRepository,
            IDivideAndSelectShapeRepository divideAndSelectShapeRepository,
            IDrawPointsInAChartRepository drawPointsInAChartRepository,
            IMultipleDragAndDrop2Repository multipleDragAndDrop2Repository,
            IShapesOverImageRepository shapesOverImageRepository,
            IMultipleDragAndDrop3Repository multipleDragAndDrop3Repository)
        {
            MovePointsInAChartRepository = movePointsInAChartRepository;
            MovePointsInALineRepository = movePointsInALineRepository;
            SelectableChartRepository = selectableChartRepository;
            MultipleDragAndDropRepository = multipleDragAndDropRepository;
            DragAndOrderRepository = dragAndOrderRepository;
            QuestionRepository = questionRepository;
            AnswerRepository = answerRepository;
            MultipleDragAndDropImageRepository = multipleDragAndDropImageRepository;
            MultipleDragAndDropJustificationRepository = multipleDragAndDropJustificationRepository;
            DrawLinesInAChartRepository = drawLinesInAChartRepository;
            MultipleDragAndDropExpressionRepository = multipleDragAndDropExpressionRepository;
            InteractiveChartRepository = interactiveChartRepository;
            DivideAndSelectShapeRepository = divideAndSelectShapeRepository;
            DrawPointsInAChartRepository = drawPointsInAChartRepository;
            MultipleDragAndDrop2Repository = multipleDragAndDrop2Repository;
            ShapesOverImageRepository = shapesOverImageRepository;
            MultipleDragAndDrop3Repository = multipleDragAndDrop3Repository;
        }

        public QuestionService(IQuestionRepository questionRepository, 
            ISubjectService subjectService, 
            IGradeService gradeService,
            IComplexityService complexityService,
            IDifficultyService diffficultyService,
            IPassageService passageService)
        {
            QuestionRepository = questionRepository;
            SubjectService = subjectService;
            GradeService = gradeService;
            ComplexityService = complexityService;
            DifficultyService = diffficultyService;
            PassageService = passageService;
        }
        
        public void Save(MovePointsInAChart question)
        {
            if(question.Id == 0)
                MovePointsInAChartRepository.Create(question);
            else
                MovePointsInAChartRepository.Update(question);
        }

        public IEnumerable<Question> GetAll()
        {
            return QuestionRepository.GetAll();
        }

        public Question Get(int id)
        {
            var question = QuestionRepository.Get(id);
            if (question != null)
            {
                if (question.QuestionTypeId == 10)  // MovePointsInAChart
                {
                    var mpic = new MovePointsInAChart(question) ;
                    var details = Serializer.Deserialize<MovePointsInAChart_QuestionXmlModel>(mpic.ExtendedDetails);
                    mpic.Domain = details.Domain;
                    mpic.MinorScale = details.MinorScale;
                    mpic.MajorScale = details.MajorScale;
                    mpic.chartType = details.chartType;

                    foreach (var answer in mpic.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<MovePointsInAChart_SpotXmlModel>(answer.ExendedDetails);
                        if (answerDetails.SpotType == "center")
                        {
                            mpic.CenterSpot = new SpotContent
                            {
                                X = answerDetails.X,
                                Y = answerDetails.Y
                            };
                        }
                        else
                        {
                            mpic.MinMaxSpot = new SpotContent
                            {
                                X = answerDetails.X,
                                Y = answerDetails.Y
                            };
                        }
                    }
                    return mpic;
                }
                else if (question.QuestionTypeId == 20)  // MovePointsInALine
                {
                    var mpil = new MovePointsInALine(question);
                    var details = Serializer.Deserialize<MovePointsInALine_QuestionXmlModel>(mpil.ExtendedDetails);
                    mpil.MinValue = details.MinValue;
                    mpil.MaxValue = details.MaxValue;
                    mpil.MinorScale = details.MinorScale;
                    mpil.MajorScale = details.MajorScale;

                    var intervalsBuffer = new List<MovePointsInALine_Interval>();
                    foreach (var answer in mpil.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<MovePointsInALine_IntervalXmlModel>(answer.ExendedDetails);
                        intervalsBuffer.Add(new MovePointsInALine_Interval
                            {
                                id = answerDetails.Id,
                                minValue = answerDetails.MinValue,
                                maxValue = answerDetails.MaxValue,
                                minValueType = answerDetails.MinValueType,
                                maxValueType = answerDetails.MaxValueType,
                                shapeType = answerDetails.ShapeType,
                                value = answerDetails.Value,
                                label = answerDetails.Label
                            });
                    }
                    mpil.Intervals = intervalsBuffer.ToArray();
                    return mpil;
                }
                else if (question.QuestionTypeId == 30)  // SelectableChart
                {
                    var sc = new SelectableChart(question);

                    var columnsBuffer = new List<SelectableChart_Column>();
                    foreach (var answer in sc.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<SelectableChart_ColumnXmlModel>(answer.ExendedDetails);
                        columnsBuffer.Add(new SelectableChart_Column
                        {
                            id = answerDetails.Id,
                            label = answerDetails.Label,
                            selected = answerDetails.Selected,
                            value = answerDetails.Value
                        });
                    }
                    sc.Columns = columnsBuffer.ToArray();
                    return sc;
                }
                else if (question.QuestionTypeId == 40)  // DragAndDrop
                {
                    var mdd = new MultipleDragAndDrop(question);

                    var details = Serializer.Deserialize<MultipleDragAndDrop_QuestionXmlModel>(mdd.ExtendedDetails);
                    mdd.AnswersList = details.Answers.Select(x => new MultipleDragAndDrop_Answer() 
                    {
                        id = x.Id,
                        text = x.Text,
                        DisplayAnswersVertically = x.DisplayAnswersVertically
                    }).ToArray() ;

                    var targetsBuffer = new List<MultipleDragAndDrop_Target>();
                    foreach (var answer in mdd.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<MultipleDragAndDrop_TargetXmlModel>(answer.ExendedDetails);
                        targetsBuffer.Add(new MultipleDragAndDrop_Target
                        {
                            id = answerDetails.Id,
                            text = answerDetails.Text,
                            answerId = answerDetails.AnswerId,
                            answerText = answerDetails.AnswerText
                        });
                    }
                    mdd.Targets = targetsBuffer.ToArray();
                    return mdd;
                }
                else if (question.QuestionTypeId == 50)  // Drag And order
                {
                    var dao = new DragAndOrder(question);

                    var optionsBuffer = new List<DragAndOrder_Option>();
                    foreach (var answer in dao.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<DragAndOrder_OptionXmlModel>(answer.ExendedDetails);
                        optionsBuffer.Add(new DragAndOrder_Option
                        {
                            id = answerDetails.Id,
                            text = answerDetails.Text,
                            worth = answerDetails.Worth
                        });
                    }
                    dao.Options = optionsBuffer.ToArray();
                    return dao;
                }
                else if (question.QuestionTypeId == 42)  // MultipleDragAndDropImage
                {
                    var mddi = new MultipleDragAndDropImage(question);

                    var AnswersList = new List<MultipleDragAndDropImage_Answer>();
                    foreach (var answer in mddi.Answers)
                    {
                        AnswersList.Add(new MultipleDragAndDropImage_Answer
                        {
                            imgName = answer.Txt,
                            imgData = null,
                            imgURL = answer.ExendedDetails,
                            isCorrect = answer.AnsVal,
                        });
                    }
                    mddi.AnswersList = AnswersList.ToArray();
                    return mddi;
                }
                else if (question.QuestionTypeId == 44)  // MultipleDragAndDropJustification
                {
                    var mdd = new MultipleDragAndDropJustification(question);

                    // method and justification questions 
                    var details = Serializer.Deserialize<MultipleDragAndDrop_JustificationQuestionXmlModel>(mdd.ExtendedDetails);
                    mdd.AnswersList = details.Answers.Select(x => new MultipleDragAndDrop_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                    }).ToArray();

                    mdd.JustificationAnswersList = details.JustificationAnswers.Select(x => new MultipleDragAndDrop_JustificationAnswer()
                    {
                        id = x.Id,
                        text = x.Text,
                    }).ToArray();

                    // method and justification  responses
                    var targetsBuffer = new List<MultipleDragAndDrop_Target>();
                    var targetsBufferj = new List<MultipleDragAndDrop_JustificationTarget>();

                    foreach (var answer in mdd.Answers)
                    {
                        if (answer.ExendedDetails.IndexOf("MultipleDragAndDrop_TargetXmlModel") >= 0)
                        {
                            //method responses
                            var answerDetails = Serializer.Deserialize<MultipleDragAndDrop_TargetXmlModel>(answer.ExendedDetails);
                            targetsBuffer.Add(new MultipleDragAndDrop_Target
                            {
                                id = answerDetails.Id,
                                text = answerDetails.Text,
                                answerId = answerDetails.AnswerId,
                                answerText = answerDetails.AnswerText
                            });
                        }
                        else if (answer.ExendedDetails.IndexOf("MultipleDragAndDrop_JustificationTargetXmlModel") >= 0)
                        {
                            //justification responses
                            var answerDetails = Serializer.Deserialize<MultipleDragAndDrop_JustificationTargetXmlModel>(answer.ExendedDetails);
                            targetsBufferj.Add(new MultipleDragAndDrop_JustificationTarget
                            {
                                id = answerDetails.Id,
                                text = answerDetails.Text,
                                answerId = answerDetails.AnswerId,
                                answerText = answerDetails.AnswerText
                            });
                        }
                    }
                        
                    mdd.Targets = targetsBuffer.ToArray();
                    mdd.JustificationTargets = targetsBufferj.ToArray();

                    return mdd;
                }
                else if (question.QuestionTypeId == 12)  // DrawLinesInAChart
                {
                    var dlc = new DrawLinesInAChart(question);

                    // chart details
                    var chartDetails = Serializer.Deserialize<DrawLinesInAChart_QuestionXmlModel>(dlc.ExtendedDetails);
                    dlc.Domain = chartDetails.Domain;
                    dlc.MajorScale = chartDetails.MajorScale;
                    dlc.MinorScale = chartDetails.MinorScale;

                    // line details
                    var AnswersList = new List<DrawLinesInAChartAnswer>();
                    foreach (var answer in dlc.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<DrawLinesInAChart_AnswerXmlModel>(answer.ExendedDetails);
                        AnswersList.Add(new DrawLinesInAChartAnswer
                        {
                            axisValue = answerDetails.axisValue,
                            axisType = answerDetails.axisType,
                        });
                    }
                    dlc.AnswersList = AnswersList.ToArray();
                    
                    return dlc;
                }
                else if (question.QuestionTypeId == 46)  // MultipleDragAndDropExpression
                {
                    var mdde = new MultipleDragAndDropExpression(question);

                    var details = Serializer.Deserialize<MultipleDragAndDropExpression_QuestionXmlModel>(mdde.ExtendedDetails);
                    mdde.AnswersList = details.Answers.Select(x => new MultipleDragAndDropExpression_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                    }).ToArray();

                    var targetsBuffer = new List<MultipleDragAndDropExpression_Target>();
                    foreach (var answer in mdde.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<MultipleDragAndDropExpression_TargetXmlModel>(answer.ExendedDetails);
                        targetsBuffer.Add(new MultipleDragAndDropExpression_Target
                        {
                            id = answerDetails.Id,
                            text = answerDetails.Text,
                            answerId = answerDetails.AnswerId,
                            answerText = answerDetails.AnswerText,
                            shape = answerDetails.Shape,
                            container = answerDetails.Container,
                            containerLabel = answerDetails.ContainerLabel,
                            containerBorder = answerDetails.ContainerBorder,
                            containerPosition = answerDetails.ContainerPosition
                        });
                    }
                    mdde.Targets = targetsBuffer.ToArray();
                    return mdde;
                }
                else if (question.QuestionTypeId == 48)  // MultipleDragAndDrop
                {
                    var mdd = new MultipleDragAndDrop2(question);

                    // get the options
                    var details = Serializer.Deserialize<MultipleDragAndDrop2_QuestionXmlModel>(mdd.ExtendedDetails);
                    mdd.AnswersList = details.Answers.Select(x => new MultipleDragAndDrop2_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                        DisplayAnswersVertically = x.DisplayAnswersVertically
                    }).ToArray();

                    var targetsBuffer = new List<MultipleDragAndDrop2_Target>();
                    
                    // get the answers
                    foreach (var answer in mdd.Answers)
                    {
                        var answerDetails = Serializer.Deserialize<MultipleDragAndDrop2_TargetXmlModel>(answer.ExendedDetails);
                        targetsBuffer.Add(new MultipleDragAndDrop2_Target
                        {
                            id = answerDetails.Id,
                            text = answerDetails.Text,
                        });
                        // add the possible options to the answer
                        for (int i = 0; i < targetsBuffer.Count; i++) {
                            if (targetsBuffer[i].id == answerDetails.Id)
                            {
                                targetsBuffer[i].Answers = answerDetails.Answers.Select(x => new MultipleDragAndDrop2_TargetAnswer()
                                 {
                                     AnswerId = x.AnswerId,
                                     AnswerText = x.AnswerText
                                 }).ToArray();
                            }
                        }
                    }

                    mdd.Targets = targetsBuffer.ToArray();
                    return mdd;
                } // else if = 48  (Multiple Drag and Drop)

            }
            return question;

        } // end Get

        public void Save(MovePointsInALine question)
        {
            if (question.Id == 0)
                MovePointsInALineRepository.Create(question);
            else
                MovePointsInALineRepository.Update(question);
        }

        public void Save(SelectableChart question)
        {
            if (question.Id == 0)
                SelectableChartRepository.Create(question);
            else
                SelectableChartRepository.Update(question);
        }

        public void Save(MultipleDragAndDrop question)
        {
            if (question.Id == 0)
                MultipleDragAndDropRepository.Create(question);
            else
                MultipleDragAndDropRepository.Update(question);
        }

        public void Save(DragAndOrder question)
        {
            if (question.Id == 0)
                DragAndOrderRepository.Create(question);
            else
                DragAndOrderRepository.Update(question);
        }

        public void Save(MultipleDragAndDropImage question)
        {
            if (question.Id == 0)
                MultipleDragAndDropImageRepository.Create(question);
            else
                MultipleDragAndDropImageRepository.Update(question);
        }

        public void Save(MultipleDragAndDropJustification question)
        {
            if (question.Id == 0)
                MultipleDragAndDropJustificationRepository.Create(question);
            else
                MultipleDragAndDropJustificationRepository.Update(question);
        }

        public void Save(DrawLinesInAChart question)
        {
            if (question.Id == 0)
                DrawLinesInAChartRepository.Create(question);
            else
                DrawLinesInAChartRepository.Update(question);
        }

        public void Save(MultipleDragAndDropExpression question)
        {
            if (question.Id == 0)
                MultipleDragAndDropExpressionRepository.Create(question);
            else
                MultipleDragAndDropExpressionRepository.Update(question);
        }

        public void Save(InteractiveChart question)
        {
            if (question.Id == 0)
                InteractiveChartRepository.Create(question);
            else
                InteractiveChartRepository.Update(question);
        }

        public void Save(DivideAndSelectShape question)
        {
            if (question.Id == 0)
                DivideAndSelectShapeRepository.Create(question);
            else
                DivideAndSelectShapeRepository.Update(question);
        }

        public void Save(DrawPointsInAChart question)
        {
            if (question.Id == 0)
                DrawPointsInAChartRepository.Create(question);
            else
                DrawPointsInAChartRepository.Update(question);
        }

        public void Save(MultipleDragAndDrop2 question)
        {
            if (question.Id == 0)
                MultipleDragAndDrop2Repository.Create(question);
            else
                MultipleDragAndDrop2Repository.Update(question);
        }

        public void Save(ShapesOverImage question)
        {
            if (question.Id == 0)
                ShapesOverImageRepository.Create(question);
            else
                ShapesOverImageRepository.Update(question);
        }

        public void Save(MultipleDragAndDrop3 question)
        {
            if (question.Id == 0)
                MultipleDragAndDrop3Repository.Create(question);
            else
                MultipleDragAndDrop3Repository.Update(question);
        }

    } // end class
} // end namespace

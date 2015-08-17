using System;
using System.Web.Mvc;
using Newtonsoft.Json;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;
using OnlineTests.Repository;
using OnlineTests.Service;
using OnlineTests.Web.Models;
using System.Linq;
using System.Web.Script.Serialization;
using System.IO;
using System.Web.Helpers;
using System.Drawing;
using OnlineTests.Common.Helpers;
using System.Text.RegularExpressions;

namespace OnlineTests.Web.Controllers
{
    public class HomeController : Controller
    {
        #region "Phase I"

             public ComplexityService ComplexityService { get; set; }
            public IQuestionService QuestionService { get; set; }

            public HomeController()
            {

            }

            public HomeController(IQuestionService questionService)
            {
                this.QuestionService = questionService;
            }

            //
            // GET: /Home/

            public ActionResult Index()
            {
                //  var data = ComplexityService.GetAll();
                return View();
            }

            public ActionResult Edit(int id)
            {
                var question = QuestionService.Get(id);
                if (question == null)
                {
                    return RedirectToAction("Home");
                }
                else
                {
                    if (question.QuestionTypeId == 10)  // MovePointsInAChart
                    {
                        var mpic = question as OnlineTests.Common.Models.MovePointsInAChart;
                        var settings = new
                        {
                            grid = new
                            {
                                domain = mpic.Domain,
                                majorScale = mpic.MajorScale,
                                minorScale = mpic.MinorScale,
                                chartType = mpic.chartType
                            },
                            centerPoint = new { x = mpic.CenterSpot.X, y = mpic.CenterSpot.Y },
                            minMaxPoint = new { x = mpic.MinMaxSpot.X, y = mpic.MinMaxSpot.Y }
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mpic.Id,
                            Notes = mpic.Notes,
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mpic.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mpic.QuestionTypeId.Value,
                            Settings = Json(settings).Data.ToString().Replace("=", ":")
                        };
                        return View("MovePointsInAChartEdit", data);
                    }
                    else if (question.QuestionTypeId == 20)  // MovePointsInALine
                    {
                        var mpil = question as OnlineTests.Common.Models.MovePointsInALine;
                        var jsj = new JavaScriptSerializer();
                        var settings = new
                        {
                            minValue = mpil.MinValue,
                            maxValue = mpil.MaxValue,
                            majorScale = mpil.MajorScale,
                            minorScale = mpil.MinorScale,
                            intervals = mpil.Intervals   //  new[] {new {minValue = 1, maxValue= 2, minValueType="open", maxValueType="open"}}
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mpil.Id,
                            Notes = mpil.Notes,
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mpil.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mpil.QuestionTypeId.Value,
                            Settings = jsj.Serialize(settings)   //.Data.ToString().Replace("=", ":")
                        };
                        return View("MovePointsInALineEdit", data);
                    }
                    else if (question.QuestionTypeId == 30)  // SelectableChart
                    {
                        var sc = question as OnlineTests.Common.Models.SelectableChart;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            columns = sc.Columns
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = sc.Id,
                            Notes = sc.Notes,
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(sc.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)sc.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("SelectableChartEdit", data);
                    }
                    else if (question.QuestionTypeId == 40)  // DragAndDrop
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDrop;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            Notes = mdd.Notes,
                            // TODO: IL - find permanent solution
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mdd.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropEdit", data);
                    }
                    else if (question.QuestionTypeId == 50)  // DragAndOrder
                    {
                        var dao = question as OnlineTests.Common.Models.DragAndOrder;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            options = dao.Options
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = dao.Id,
                            Notes = dao.Notes,
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(dao.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)dao.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("DragAndOrderEdit", data);
                    }
                    else if (question.QuestionTypeId == 42)  // MultipleDragAndDropImage
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDropImage;

                        // let's convert the image to base64 string
                        for (int i = 0; i < mdd.AnswersList.Length; i++)
                        {
                            string fileUrl = Server.MapPath(mdd.AnswersList[i].imgURL);

                            if (!System.IO.File.Exists(Server.MapPath(mdd.AnswersList[i].imgURL)))
                            {
                                fileUrl = Regex.Replace(fileUrl, "%20", " ", RegexOptions.IgnoreCase);
                            }

                            using (Image image = Image.FromFile(fileUrl))
                            {
                                using (MemoryStream m = new MemoryStream())
                                {
                                    image.Save(m, image.RawFormat);
                                    byte[] imageBytes = m.ToArray();

                                    // Convert byte[] to Base64 String
                                    string base64String = Convert.ToBase64String(imageBytes);
                                    string fileType = Path.GetExtension(Server.MapPath(mdd.AnswersList[i].imgURL));
                                    fileType = fileType.Remove(0, 1);  // remove the "."
                                    mdd.AnswersList[i].imgData = "data:image/" + fileType + ";base64," + base64String;
                                }
                            }
                        }

                        var data = new EditMDDImageQuestionModel
                        {
                            QuestionId = mdd.Id,
                            Notes = mdd.Notes,
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mdd.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            AnswersList = mdd.AnswersList
                        };
                        return View("MultipleDragAndDropImageEdit", data);
                    }
                    else if (question.QuestionTypeId == 44)  // MultipleDragAndDropJustification
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDropJustification;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets,
                            answersJustification = mdd.JustificationAnswersList,
                            targetsJustification = mdd.JustificationTargets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            Notes = mdd.Notes,
                            // TODO: IL - find permanent solution
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mdd.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropJustificationEdit", data);
                    }
                    else if (question.QuestionTypeId == 12)  // DrawLinesInAChart
                    {
                        var dlc = question as OnlineTests.Common.Models.DrawLinesInAChart;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            grid = new
                            {
                                domain = dlc.Domain,
                                majorScale = dlc.MajorScale,
                                minorScale = dlc.MinorScale
                            },
                            answers = dlc.AnswersList
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = dlc.Id,
                            Notes = dlc.Notes,
                            // TODO: IL - find permanent solution
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(dlc.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)dlc.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                            //Json(settings).Data.ToString().Replace("=", ":")
                        };
                        return View("DrawLinesInAChartEdit", data);
                    }
                    else if (question.QuestionTypeId == 46)  // MultipleDragAndDropExpression
                    {
                        var mdde = question as OnlineTests.Common.Models.MultipleDragAndDropExpression;

                        var containers = new MultipleDragAndDropExpression_Container[mdde.Targets.Length].Select(c => new MultipleDragAndDropExpression_Container()).ToArray();
                        for (int i = 0; i < mdde.Targets.Length; i++)
                        {
                            containers[i].container = mdde.Targets[i].container;
                            containers[i].containerBorder = mdde.Targets[i].containerBorder;
                            containers[i].containerLabel = mdde.Targets[i].containerLabel;
                            containers[i].containerPosition = mdde.Targets[i].containerPosition;
                        }

                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdde.AnswersList,
                            targets = mdde.Targets,
                            containerSettings = containers
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdde.Id,
                            Notes = mdde.Notes,
                            // TODO: IL - find permanent solution
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mdde.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mdde.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropExpresionEdit", data);
                    }
                    else if (question.QuestionTypeId == 32)  // InteractiveChart
                    {
                        var settings = Serializer.Deserialize<InteractiveChartSettings>(question.ExtendedDetails);
                        var data = new
                        {
                            QuestionId = question.Id,
                            Notes = question.Notes ?? "",
                            QuestionText = question.QuestionText ?? "",
                            QuestionTypeId = (short)(question.QuestionTypeId.HasValue ? question.QuestionTypeId.Value : QT_IC),
                            Settings = settings
                        };
                        ViewBag.settings = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                        return View("InteractiveChart", data);
                    }
                    else if (question.QuestionTypeId == 34)  // DivideAndSelectShape
                    {
                        var settings = Serializer.Deserialize<DivideAndSelectShapeSettings>(question.ExtendedDetails);
                        var data = new
                        {
                            QuestionId = question.Id,
                            Notes = question.Notes ?? "",
                            QuestionText = question.QuestionText ?? "",
                            QuestionTypeId = (short)(question.QuestionTypeId.HasValue ? question.QuestionTypeId.Value : QT_DASS),
                            Settings = settings
                        };
                        ViewBag.settings = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                        return View("DivideAndSelectShape", data);
                    }
                    else if (question.QuestionTypeId == 36)  // DrawPointsInAChart
                    {
                        var settings = Serializer.Deserialize<DrawPointsInAChartSettings>(question.ExtendedDetails);
                        var data = new
                        {
                            QuestionId = question.Id,
                            Notes = question.Notes ?? "",
                            QuestionText = question.QuestionText ?? "",
                            QuestionTypeId = (short)(question.QuestionTypeId.HasValue ? question.QuestionTypeId.Value : QT_DPC),
                            Settings = settings
                        };
                        ViewBag.settings = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                        //return View("DrawPointsInAChart", data);
                        return View("DrawPointsInAChart");
                    }
                    else if (question.QuestionTypeId == 48)  // MultipleDragAndDrop
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDrop2;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            Notes = mdd.Notes,
                            // TODO: IL - find permanent solution
                            QuestionText = ccpsHtmlHelper.RemoveInsignificantHtmlWhiteSpace(mdd.QuestionText).Replace("\\", "\\\\").Replace("'", "\\u0027") ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        //return View("MultipleDragAndDrop2Edit", data);
                        return View("MultipleDragAndDrop2Edit");
                    }
                    else if (question.QuestionTypeId == 38)  // ShapesOverImage
                    {
                        var settings = Serializer.Deserialize<ShapesOverImageSettings>(question.ExtendedDetails);
                        var data = new
                        {
                            QuestionId = question.Id,
                            Notes = question.Notes ?? "",
                            QuestionText = question.QuestionText ?? "",
                            QuestionTypeId = (short)(question.QuestionTypeId.HasValue ? question.QuestionTypeId.Value : QT_SOI),
                            Settings = settings
                        };
                        ViewBag.settings = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                        //return View("ShapesOverImage", data);
                        return View("ShapesOverImage");
                    }
                    else if (question.QuestionTypeId == 52)  // MultipleDragAndDrop3 (MultipleQuestion)
                    {
                        var settings = Serializer.Deserialize<MultipleDragAndDrop3Settings>(question.ExtendedDetails);
                        var data = new
                        {
                            QuestionId = question.Id,
                            Notes = question.Notes,
                            QuestionText = question.QuestionText ?? "",
                            QuestionTypeId = (short)(question.QuestionTypeId.HasValue ? question.QuestionTypeId.Value : QT_MQ   ),
                            Settings = settings
                        };
                        var settings2Json = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                        ViewBag.settings = settings2Json;
                        return View("MultipleDragAndDrop");
                    }

                    return null;
                }
            }

            public ActionResult View(int id)
            {
                var question = QuestionService.Get(id);
                if (question == null)
                {
                    return RedirectToAction("Home");
                }
                else
                {
                    if (question.QuestionTypeId == 50)  // DragAndOrder
                    {
                        var dao = question as OnlineTests.Common.Models.DragAndOrder;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            options = dao.Options
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = dao.Id,
                            QuestionText = dao.QuestionText,
                            QuestionTypeId = (short)dao.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("DragAndOrderView", data);
                    }
                    else if (question.QuestionTypeId == 40)  // DragAndDrop
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDrop;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            QuestionText = mdd.QuestionText ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropView", data);
                    }
                    else if (question.QuestionTypeId == 30)  // SelectableChart
                    {
                        var sc = question as OnlineTests.Common.Models.SelectableChart;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            columns = sc.Columns
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = sc.Id,
                            QuestionText = sc.QuestionText ?? "",
                            QuestionTypeId = (short)sc.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("SelectableChartView", data);
                    }
                    else if (question.QuestionTypeId == 10)  // MovePointsInAChart
                    {
                        var mpic = question as OnlineTests.Common.Models.MovePointsInAChart;
                        var settings = new
                        {
                            grid = new
                            {
                                domain = mpic.Domain,
                                majorScale = mpic.MajorScale,
                                minorScale = mpic.MinorScale,
                                chartType = mpic.chartType
                            },
                            centerPoint = new { x = mpic.CenterSpot.X, y = mpic.CenterSpot.Y },
                            minMaxPoint = new { x = mpic.MinMaxSpot.X, y = mpic.MinMaxSpot.Y }
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mpic.Id,
                            QuestionText = mpic.QuestionText ?? "",
                            QuestionTypeId = (short)mpic.QuestionTypeId.Value,
                            Settings = Json(settings).Data.ToString().Replace("=", ":")
                        };
                        return View("MovePointsInAChartView", data);
                    }
                    else if (question.QuestionTypeId == 20)  // MovePointsInALine
                    {
                        var mpil = question as OnlineTests.Common.Models.MovePointsInALine;
                        var jsj = new JavaScriptSerializer();
                        var settings = new
                        {
                            minValue = mpil.MinValue,
                            maxValue = mpil.MaxValue,
                            majorScale = mpil.MajorScale,
                            minorScale = mpil.MinorScale,
                            intervals = mpil.Intervals   //  new[] {new {minValue = 1, maxValue= 2, minValueType="open", maxValueType="open"}}
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mpil.Id,
                            QuestionText = mpil.QuestionText ?? "",
                            QuestionTypeId = (short)mpil.QuestionTypeId.Value,
                            Settings = jsj.Serialize(settings)   //.Data.ToString().Replace("=", ":")
                        };
                        return View("MovePointsInALineView", data);
                    }
                    else if (question.QuestionTypeId == 42)  // MultipleDragAndDropImage
                    {
                        var mddi = question as OnlineTests.Common.Models.MultipleDragAndDropImage;

                        // let's convert the image to base64 string
                        for (int i = 0; i < mddi.AnswersList.Length; i++)
                        {
                            using (Image image = Image.FromFile(Server.MapPath(mddi.AnswersList[i].imgURL)))
                            {
                                using (MemoryStream m = new MemoryStream())
                                {
                                    image.Save(m, image.RawFormat);
                                    byte[] imageBytes = m.ToArray();

                                    // Convert byte[] to Base64 String
                                    string base64String = Convert.ToBase64String(imageBytes);
                                    string fileType = Path.GetExtension(Server.MapPath(mddi.AnswersList[i].imgURL));
                                    fileType = fileType.Remove(0, 1);  // remove the "."
                                    mddi.AnswersList[i].imgData = "data:image/" + fileType + ";base64," + base64String;
                                }
                            }
                        }

                        var data = new EditMDDImageQuestionModel
                        {
                            QuestionId = mddi.Id,
                            QuestionText = mddi.QuestionText ?? "",
                            QuestionTypeId = (short)mddi.QuestionTypeId.Value,
                            AnswersList = mddi.AnswersList
                        };
                        return View("MultipleDragAndDropImageView", data);
                    }
                    else if (question.QuestionTypeId == 44)  // MultipleDragAndDropJustification
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDropJustification;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets,
                            answersJustification = mdd.JustificationAnswersList,
                            targetsJustification = mdd.JustificationTargets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            QuestionText = mdd.QuestionText ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropJustificationView", data);
                    }
                    else if (question.QuestionTypeId == 12)  // DrawLinesInAChart
                    {
                        var dlc = question as OnlineTests.Common.Models.DrawLinesInAChart;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            grid = new
                            {
                                domain = dlc.Domain,
                                majorScale = dlc.MajorScale,
                                minorScale = dlc.MinorScale
                            },
                            answers = dlc.AnswersList
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = dlc.Id,
                            Notes = dlc.Notes,
                            QuestionText = dlc.QuestionText ?? "",
                            QuestionTypeId = (short)dlc.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("DrawLinesInAChartView", data);
                    }
                    else if (question.QuestionTypeId == 46)  // MultipleDragAndDropExpression
                    {
                        var mdde = question as OnlineTests.Common.Models.MultipleDragAndDropExpression;

                        var containers = new MultipleDragAndDropExpression_Container[mdde.Targets.Length].Select(c => new MultipleDragAndDropExpression_Container()).ToArray();
                        for (int i = 0; i < mdde.Targets.Length; i++)
                        {
                            containers[i].container = mdde.Targets[i].container;
                            containers[i].containerBorder = mdde.Targets[i].containerBorder;
                            containers[i].containerLabel = mdde.Targets[i].containerLabel;
                            containers[i].containerPosition = mdde.Targets[i].containerPosition;
                        }

                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdde.AnswersList,
                            targets = mdde.Targets,
                            containerSettings = containers
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdde.Id,
                            QuestionText = mdde.QuestionText ?? "",
                            QuestionTypeId = (short)mdde.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDropExpresionView", data);
                    }
                    else if (question.QuestionTypeId == 48)  // MultipleDragAndDrop
                    {
                        var mdd = question as OnlineTests.Common.Models.MultipleDragAndDrop2;
                        var js = new JavaScriptSerializer();
                        var settings = new
                        {
                            answers = mdd.AnswersList,
                            targets = mdd.Targets
                        };

                        var data = new EditQuestionModel
                        {
                            QuestionId = mdd.Id,
                            QuestionText = mdd.QuestionText ?? "",
                            QuestionTypeId = (short)mdd.QuestionTypeId.Value,
                            Settings = js.Serialize(settings)
                        };
                        return View("MultipleDragAndDrop2View", data);
                    }

                }

                return null;
            } // end ActionResult View

            [HttpPost]
            public JsonResult MovePointsInAChart_Save(MovePointsInAChartModel questionModel)
            {
                var question = new Common.Models.MovePointsInAChart
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    Domain = questionModel.Domain,
                    chartType = questionModel.chartType,
                    MajorScale = questionModel.MajorScale,
                    MinorScale = questionModel.MinorScale,
                    CenterSpot = new Common.Models.SpotContent { X = questionModel.CenterSpot.X, Y = questionModel.CenterSpot.Y },
                    MinMaxSpot = new Common.Models.SpotContent { X = questionModel.MinMaxSpot.X, Y = questionModel.MinMaxSpot.Y }
                };

                this.QuestionService.Save(question);

                return Json(new
                {
                    status = "Ok",
                    data = question.Id
                    //details = questionModel.Components,
                    //parsed = components[0].Contents,
                    //parsed1 = components[1].Contents
                });
            }

            [HttpPost]
            public JsonResult MovePointsInALine_Save(MovePointsInALineModel questionModel)
            {
                var question = new Common.Models.MovePointsInALine
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    MinValue = questionModel.MinValue,
                    MaxValue = questionModel.MaxValue,
                    MajorScale = questionModel.MajorScale,
                    MinorScale = questionModel.MinorScale,
                    Intervals = questionModel.Intervals.Select(x => new Common.Models.MovePointsInALine_Interval
                    {
                        minValue = x.MinValue,
                        maxValue = x.MaxValue,
                        minValueType = x.MinValueType,
                        maxValueType = x.MaxValueType,
                        shapeType = x.ShapeType,
                        value = x.Value,
                        label = x.Label ?? string.Empty
                    }
                    ).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(new
                {
                    status = "Ok",
                    data = question.Id
                });
            }

            [HttpPost]
            public JsonResult SelectableChart_Save(SelectableChartModel questionModel)
            {

                var question = new Common.Models.SelectableChart
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    Columns = questionModel.ChartColumns.Where(x => !String.IsNullOrEmpty(x.Etiqueta))
                    .Select(x => new Common.Models.SelectableChart_Column()
                    {
                        id = x.Id,
                        label = x.Etiqueta,
                        selected = x.Option,
                        value = x.Valor
                    }).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            [HttpPost]
            public JsonResult MultipleDragAndDrop_Save(MultipleDragAndDropModel questionModel)
            {
                var question = new Common.Models.MultipleDragAndDrop
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    AnswersList = questionModel.Answers.Select(x => new Common.Models.MultipleDragAndDrop_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                        DisplayAnswersVertically = x.DisplayAnswersVertically
                    }).ToArray(),
                    Targets = questionModel.Targets.Select(x => new Common.Models.MultipleDragAndDrop_Target()
                    {
                        id = x.Id,
                        text = x.Text,
                        answerId = x.AnswerId,
                        answerText = x.AnswerText
                    }).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            [HttpPost]
            public JsonResult DragAndOrder_Save(DragAndOrderModel questionModel)
            {
                var question = new Common.Models.DragAndOrder
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    Options = questionModel.Options.Select(x => new Common.Models.DragAndOrder_Option()
                    {
                        id = x.Id,
                        text = x.Text,
                        worth = x.Worth
                    }).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            [HttpPost]
            public JsonResult MultipleDragAndDropImage_Save(MultipleDragAndDropImageModel questionModel)
            {
                var question = new Common.Models.MultipleDragAndDropImage
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,

                    AnswersList = questionModel.Answers.Select(x => new Common.Models.MultipleDragAndDropImage_Answer()
                    {
                        imgName = x.imgName,
                        imgData = x.imgData,
                        imgURL = string.Empty,
                        isCorrect = x.isCorrect
                    }).ToArray(),
                };

                // let's save the images to the server and update the imageURL on the answers
                foreach (MultipleDragAndDropImage_Answer answer in question.AnswersList)
                {
                    // let's replace the "%20" characters with " " (empty space)
                    answer.imgName = Regex.Replace(answer.imgName, "%20", " ", RegexOptions.IgnoreCase);

                    // let's remove the "data:image/xxx;base64," string and leave the base64 image string
                    int intCharsToRemove = answer.imgData.IndexOf("base64,") + "base64,".Length;
                    answer.imgData = answer.imgData.Remove(0, intCharsToRemove);

                    byte[] webImgSrc = Convert.FromBase64String(answer.imgData);
                    var uploadDir = "/images/ImagesFinder/images/";
                    var imagePath = Path.Combine(Server.MapPath(uploadDir), answer.imgName);
                    var imageUrl = Path.Combine(uploadDir, answer.imgName);

                    var webImg = new WebImage(webImgSrc);
                    webImg.Save(imagePath);

                    answer.imgURL = imageUrl;
                }

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            [HttpPost]
            public JsonResult MultipleDragAndDropJustification_Save(MultipleDragAndDropJustificationModel questionModel)
            {
                var question = new Common.Models.MultipleDragAndDropJustification
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    AnswersList = questionModel.Answers.Select(x => new Common.Models.MultipleDragAndDrop_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                        DisplayAnswersVertically = x.DisplayAnswersVertically
                    }).ToArray(),

                    Targets = questionModel.Targets.Select(x => new Common.Models.MultipleDragAndDrop_Target()
                    {
                        id = x.Id,
                        text = x.Text,
                        answerId = x.AnswerId,
                        answerText = x.AnswerText
                    }).ToArray(),

                    JustificationAnswersList = questionModel.Justification_Answers.Select(x => new Common.Models.MultipleDragAndDrop_JustificationAnswer()
                    {
                        id = x.Id,
                        text = x.Text,
                    }).ToArray(),

                    JustificationTargets = questionModel.Justification_Targets.Select(x => new Common.Models.MultipleDragAndDrop_JustificationTarget()
                    {
                        id = x.Id,
                        text = x.Text,
                        answerId = x.AnswerId,
                        answerText = x.AnswerText
                    }).ToArray()

                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            [HttpPost]
            public JsonResult DrawLinesInAChart_Save(DrawLinesInAChartModel questionModel)
            {
                var question = new Common.Models.DrawLinesInAChart
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    Domain = questionModel.Domain,
                    MajorScale = questionModel.MajorScale,
                    MinorScale = questionModel.MinorScale,
                    AnswersList = questionModel.Answers.Select(x => new Common.Models.DrawLinesInAChartAnswer()
                    {
                        axisValue = x.axisValue,
                        axisType = x.axisType,
                    }).ToArray(),
                };

                this.QuestionService.Save(question);

                return Json(new
                {
                    status = "Ok",
                    data = question.Id
                });
            }

            [HttpPost]
            public JsonResult MultipleDragAndDropExpression_Save(MultipleDragAndDropExpressionModel questionModel)
            {
                var question = new Common.Models.MultipleDragAndDropExpression
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    AnswersList = questionModel.Answers.Select(x => new Common.Models.MultipleDragAndDropExpression_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                    }).ToArray(),
                    Targets = questionModel.Targets.Select(x => new Common.Models.MultipleDragAndDropExpression_Target()
                    {
                        id = x.Id,
                        text = x.Text,
                        answerId = x.AnswerId,
                        answerText = x.AnswerText,
                        container = x.Container,
                        shape = x.Shape,
                        containerLabel = x.ContainerLabel,
                        containerBorder = x.ContainerBorder,
                        containerPosition = x.ContainerPosition
                    }).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

            // returns the create page based on the question type
            // qt = question type
            public ActionResult Create(int? qt)
            {
                string targetPage = string.Empty;

                switch (qt)
                {
                    case 10:
                        targetPage = "MovePointsInAChartPartial";
                        break;
                    case 12:
                        targetPage = "DrawLinesInAChartPartial";
                        break;
                    case 20:
                        targetPage = "MovePointsInALinePartial";
                        break;
                    case 30:
                        targetPage = "SelectableChartPartial";
                        break;
                    case 40:
                        targetPage = "MultipleDragAndDropPartial";
                        break;
                    case 42:
                        targetPage = "MultipleDragAndDropImagePartial";
                        break;
                    case 44:
                        targetPage = "MultipleDragAndDropJustificationPartial";
                        break;
                    case 50:
                        targetPage = "DragAndOrderPartial";
                        break;
                    case 46:
                        targetPage = "MultipleDragAndDropExpresionPartial";
                        break;
                    case 48:
                        targetPage = "MultipleDragAndDrop2Partial";
                        break;
                    default:
                        targetPage = "Index";
                        break;
                }

                return View(targetPage);
            }

            [HttpPost]
            public JsonResult MultipleDragAndDrop2_Save(MultipleDragAndDrop2Model questionModel)
            {
                var question = new Common.Models.MultipleDragAndDrop2
                {
                    Id = questionModel.Id.HasValue ? questionModel.Id.Value : 0,
                    CreateDate = DateTime.Now,
                    Notes = questionModel.Notes,
                    QuestionText = questionModel.QuestionText,
                    QuestionTypeId = (byte?)questionModel.QuestionTypeId,
                    StatusId = 1,
                    AnswersList = questionModel.Answers.Select(x => new Common.Models.MultipleDragAndDrop2_Answer()
                    {
                        id = x.Id,
                        text = x.Text,
                        DisplayAnswersVertically = x.DisplayAnswersVertically
                    }).ToArray(),
                    Targets = questionModel.Targets.Select(x => new Common.Models.MultipleDragAndDrop2_Target()
                    {
                        id = x.Id,
                        text = x.Text,
                        Answers = x.Answers.Select(a => new Common.Models.MultipleDragAndDrop2_TargetAnswer()
                        {
                            AnswerId = a.AnswerId,
                            AnswerText = a.AnswerText
                        }).ToArray(),
                    }).ToArray()
                };

                this.QuestionService.Save(question);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = question.Id
                    }
                );
            }

        #endregion // end of Phase I

        #region "Phase II"

            const int QT_IC = 32;
            const int QT_DASS = 34;
            const int QT_DPC = 36;
            const int QT_SOI = 38;
            const int QT_MQ = 52;

            public ActionResult InteractiveChart()
            {
                return View();
            }

            public ActionResult DivideAndSelectShape()
            {
                return View();
            }

            public ActionResult DrawPointsInAChart()
            {
                return View();
            }

            public ActionResult ShapesOverImage()
            {
                return View();
            }

            public ActionResult MultipleQuestion()
            {
                return View("MultipleDragAndDrop");
            }

            [HttpPost]
            public ActionResult SaveQuestion(string settings)
            {
                var question = JsonConvert.DeserializeObject<QuestionViewModel>(settings);

                if (question.questionType == "InteractiveChart")
                {
                    return SaveInteractiveChart(question);
                }
                else if (question.questionType == "DivideAndSelectShape")
                {
                    return SaveDivideAndSelectShape(question);
                }
                else if (question.questionType == "DrawPointsInAChart")
                {
                    return SaveDrawPointsInAChart(question);
                }
                else if (question.questionType == "ShapesOverImage")
                {
                    return SaveShapesOverImage(question);
                }
                else if (question.questionType == "MultipleDragAndDrop2")
                {
                    return SaveMultipleDragAndDrop(question);
                }

                return null;
            }

            public ActionResult SaveInteractiveChart(QuestionViewModel question)
            {
                var interactiveChart = JsonConvert.DeserializeObject<InteractiveChart>(question.interactiveChart);

                //interactiveChart.Id = question.questionId;
                interactiveChart.Id = question.id ?? 0;
                interactiveChart.QuestionText = question.questionText;
                interactiveChart.QuestionTypeId = QT_IC;
                interactiveChart.Notes = question.questionNotes;

                this.QuestionService.Save(interactiveChart);

                return Json(
                    new
                    {
                        status = "Ok",
                        data = interactiveChart.Id,
                        type = QT_IC
                    }
                );
            }

            public ActionResult SaveDivideAndSelectShape(QuestionViewModel question)
            {
                var divideAndSelectShape = JsonConvert.DeserializeObject<DivideAndSelectShape>(question.divideAndSelectShape);

                //divideAndSelectShape.Id = question.questionId;
                divideAndSelectShape.Id = question.id ?? 0;
                divideAndSelectShape.QuestionText = question.questionText;
                divideAndSelectShape.QuestionTypeId = QT_DASS;
                divideAndSelectShape.Notes = question.questionNotes;

                this.QuestionService.Save(divideAndSelectShape);

                return Json(
                new
                {
                    status = "Ok",
                    data = divideAndSelectShape.Id,
                    type = QT_DASS
                });
            }

            public ActionResult SaveDrawPointsInAChart(QuestionViewModel question)
            {
                var drawPointsInAChart = JsonConvert.DeserializeObject<DrawPointsInAChart>(question.drawPointsInAChart);

                //drawPointsInAChart.Id = question.questionId;
                drawPointsInAChart.Id = question.id ?? 0;
                drawPointsInAChart.QuestionText = question.questionText;
                drawPointsInAChart.QuestionTypeId = QT_DPC;
                drawPointsInAChart.Notes = question.questionNotes;

                this.QuestionService.Save(drawPointsInAChart);

                return Json(
                new
                {
                    status = "Ok",
                    data = drawPointsInAChart.Id,
                    type = QT_DPC
                });
            }

            public ActionResult SaveShapesOverImage(QuestionViewModel question)
            {
                var shapesOverImage = JsonConvert.DeserializeObject<ShapesOverImage>(question.shapesOverImage);

                //shapesOverImage.Id = question.questionId;
                shapesOverImage.Id = question.id ?? 0;
                shapesOverImage.QuestionText = question.questionText;
                shapesOverImage.QuestionTypeId = QT_SOI;
                shapesOverImage.Notes = question.questionNotes;

                this.QuestionService.Save(shapesOverImage);

                return Json(
                new
                {
                    status = "Ok",
                    data = shapesOverImage.Id,
                    type = QT_DPC
                });
            }

            public ActionResult SaveMultipleDragAndDrop(QuestionViewModel question)
            {
                var multipleDragAndDrop = JsonConvert.DeserializeObject<MultipleDragAndDrop3>(question.multipleDragAndDrop);

                //multipleDragAndDrop.Id = question.questionId;
                multipleDragAndDrop.Id = question.id ?? 0;
                multipleDragAndDrop.QuestionText = question.questionText;
                multipleDragAndDrop.QuestionTypeId = QT_MQ;
                multipleDragAndDrop.Notes = question.questionNotes;

                this.QuestionService.Save(multipleDragAndDrop);

                return Json(new
                {
                    status = "Ok",
                    data = multipleDragAndDrop.Id,
                    type = QT_MQ
                });
            }

            public ActionResult LoadQuestion(int id)
            {
                var question = QuestionService.Get(id);
                var ic = question as OnlineTests.Common.Models.Question;

                var settings = Serializer.Deserialize<InteractiveChartSettings>(question.ExtendedDetails);
                var data = new
                {
                    QuestionId = ic.Id,
                    Notes = ic.Notes ?? string.Empty,
                    QuestionText = ic.QuestionText ?? string.Empty,
                    QuestionTypeId = (short)(ic.QuestionTypeId.HasValue ? ic.QuestionTypeId.Value : 32),
                    Settings = Json(settings).Data
                };

                return Json(data, JsonRequestBehavior.AllowGet);
            }

            public ActionResult DivideAndSelectShapeTemplate()
            {
                return View();
            }

            public ActionResult InteractiveChartTemplate()
            {
                return View();
            }


        #endregion // Phase II

    } // end class
} // end name space

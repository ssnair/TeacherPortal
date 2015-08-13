using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Web.Models;

namespace OnlineTests.Web.Controllers
{
    public class BetaQuestionController : Controller
    {
        public IQuestionService QuestionService { get; set; }

        public BetaQuestionController(IQuestionService questionService)
        {
            QuestionService = questionService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            var question = new QuestionModel();
            return View(question);
        }


    }
}

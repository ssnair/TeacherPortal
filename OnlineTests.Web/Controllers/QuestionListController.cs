using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Helpers;
using OnlineTests.Common.Models;
using OnlineTests.Repository;
using OnlineTests.Repository.Model;
using OnlineTests.Service;

namespace OnlineTests.Web.Controllers
{
    public class QuestionListController : Controller
    {
        public IQuestionService QuestionService { get; set; }

        public QuestionListController(IQuestionService questionService)
        {
            this.QuestionService = questionService;
        }

        public ActionResult Index()
        {
            var questions = QuestionService.GetAll();

            return View(questions);
        }

     
    }
}

using System.Collections;
using System.Collections.Generic;
using System.Web.Mvc;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Common.Models;
using OnlineTests.Service;

namespace OnlineTests.Web.Models
{
    public class LookupsModel
    {
        public IEnumerable<Subject> Subjects { get; set; }
        public IEnumerable<Grade> Grades { get; set; }
        public IEnumerable<Complexity> Complexities{ get; set; }
        public IEnumerable<Difficulty> Difficulties { get; set; }
        public IEnumerable<Passage> Passages { get; set; }
        public IEnumerable<SelectListItem> QuestionTypes { get; set; }

        public LookupsModel(IQuestionService questionService)
        {
            Subjects = questionService.SubjectService.GetAll();
            Grades = questionService.GradeService.GetAll();
            Complexities = questionService.ComplexityService.GetAll();
            Difficulties = questionService.DifficultyService.GetAll();
            Passages = questionService.PassageService.GetAll();
            QuestionTypes = new List<SelectListItem>() {           
                new SelectListItem {Value = "1", Text = "Choices"},
                new SelectListItem {Value = "2", Text = "Gridded"},
                new SelectListItem {Value = "3", Text = "Open-ended"},
                new SelectListItem {Value = "4", Text = "Technology Enhance"},
                new SelectListItem {Value = "5", Text = "Matching"},
            };
        }
    }
}
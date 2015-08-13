using Ninject.Modules;
using OnlineTests.DummyRepository;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Service;

namespace OnlineTests.BackendTest
{
    public class Bindings : NinjectModule
    {
        public override void Load()
        {
            Bind<IOnlineTestRepository>().To<OnlineTestRepository>();
            Bind<IOnlineTestService>().To<OnlineTestService>();

            Bind<IQuestionRepository>().To<QuestionRepository>();
            Bind<IQuestionService>().To<QuestionService>();

            #region Legacy
            Bind<IComplexityRepository>().To<ComplexityRepository>();
            Bind<IComplexityService>().To<ComplexityService>();

            Bind<ISubjectRepository>().To<SubjectRepository>();
            Bind<ISubjectService>().To<SubjectService>();

            Bind<IDifficultyRepository>().To<DifficultyRepository>();
            Bind<IDifficultyService>().To<DifficultyService>();

            Bind<IItemTypeRepository>().To<ItemTypeRepository>();
            Bind<IItemTypeService>().To<ItemTypeService>();

            Bind<IPassageRepository>().To<PassageRepository>();
            Bind<IPassageService>().To<PassageService>();

            Bind<IGradeRepository>().To<GradeRepository>();
            Bind<IGradeService>().To<GradeService>();
            #endregion

        }
    }
}

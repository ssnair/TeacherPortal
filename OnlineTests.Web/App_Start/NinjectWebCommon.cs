using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Contracts.Services;
using OnlineTests.Repository;
using OnlineTests.Service;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(OnlineTests.Web.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(OnlineTests.Web.App_Start.NinjectWebCommon), "Stop")]

namespace OnlineTests.Web.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {

            #region Legacy
            kernel.Bind<IComplexityRepository>().To<ComplexityRepository>();
            kernel.Bind<IComplexityService>().To<ComplexityService>();

            kernel.Bind<IQuestionService>().To<QuestionService>();
            kernel.Bind<IQuestionRepository>().To<QuestionRepository>();
            kernel.Bind<IAnswerRepository>().To<AnswerRepository>();

            kernel.Bind<IMovePointsInAChartRepository>().To<MovePointsInAChartRepository>();
            kernel.Bind<IMovePointsInALineRepository>().To<MovePointsInALineRepository>();
            kernel.Bind<ISelectableChartRepository>().To<SelectableChartRepository>();
            kernel.Bind<IMultipleDragAndDropRepository>().To<MultipleDragAndDropRepository>();
            kernel.Bind<IDragAndOrderRepository>().To<DragAndOrderRepository>();

            kernel.Bind<IMultipleDragAndDropImageRepository>().To<MultipleDragAndDropImageRepository>();
            kernel.Bind<IMultipleDragAndDropJustificationRepository>().To<MultipleDragAndDropJustificationRepository>();
            kernel.Bind<IDrawLinesInAChartRepository>().To<DrawLinesInAChartRepository>();

            kernel.Bind<IMultipleDragAndDropExpressionRepository>().To<MultipleDragAndDropExpressionRepository>();

            kernel.Bind<IInteractiveChartRepository>().To<InteractiveChartRepository>();
            kernel.Bind<IDivideAndSelectShapeRepository>().To<DivideAndSelectShapeRepository>();
            kernel.Bind<IDrawPointsInAChartRepository>().To<DrawPointsInAChartRepository>();
            kernel.Bind<IShapesOverImageRepository>().To<ShapesOverImageRepository>();
            kernel.Bind<IMultipleDragAndDrop3Repository>().To<MultipleDragAndDrop3Repository>();

            kernel.Bind<IMultipleDragAndDrop2Repository>().To<MultipleDragAndDrop2Repository>();

            #endregion
        }        
    }
}

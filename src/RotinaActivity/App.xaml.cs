using System;
using System.Threading.Tasks;
using System.Windows;
using RotinaActivity.Services;

namespace RotinaActivity
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Register Global Unhandled Exception Handlers
            AppDomain.CurrentDomain.UnhandledException += (s, args) =>
            {
                if (args.ExceptionObject is Exception ex)
                {
                    LoggerService.LogException(ex, "AppDomain.UnhandledException", 500);
                }
            };

            this.DispatcherUnhandledException += (s, args) =>
            {
                LoggerService.LogException(args.Exception, "DispatcherUnhandledException", 501);
                args.Handled = true; // Prevent app crash
            };

            TaskScheduler.UnobservedTaskException += (s, args) =>
            {
                LoggerService.LogException(args.Exception, "TaskScheduler.UnobservedTaskException", 502);
                args.SetObserved();
            };

            LoggerService.LogInfo("RotinaActivity Application Started cleanly.");
        }
    }
}

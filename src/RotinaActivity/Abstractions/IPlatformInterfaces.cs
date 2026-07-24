using System;
using System.Threading.Tasks;

namespace RotinaActivity.Abstractions
{
    public interface IWindowTracker
    {
        (string appName, string windowTitle, string processPath) GetActiveWindowInfo();
    }

    public interface IIdleTracker
    {
        uint GetIdleTimeSeconds();
    }

    public interface ISystemMetricsProvider
    {
        (float cpuPercent, float ramMb, float diskPercent) GetMetrics();
    }

    public interface IActivityCollector
    {
        Task StartMonitoringAsync();
        Task StopMonitoringAsync();
    }
}

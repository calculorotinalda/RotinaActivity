using System;
using System.IO;
using System.Text;

namespace RotinaActivity.Services
{
    public static class LoggerService
    {
        private static readonly object _lockObj = new object();
        private static readonly string _logFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "log.txt");

        static LoggerService()
        {
            InitializeLog();
        }

        public static void InitializeLog()
        {
            try
            {
                lock (_lockObj)
                {
                    string header = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] RotinaActivity Engine Logging Subsystem Initialized cleanly.\n";
                    File.AppendAllText(_logFilePath, header, Encoding.UTF8);
                }
            }
            catch
            {
                // Silently ignore if file access is temporarily locked
            }
        }

        public static void LogInfo(string message)
        {
            try
            {
                lock (_lockObj)
                {
                    string logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [INFO] {message}\n";
                    File.AppendAllText(_logFilePath, logEntry, Encoding.UTF8);
                }
            }
            catch { }
        }

        public static void LogException(Exception ex, string context = "", int errorCode = 500)
        {
            try
            {
                lock (_lockObj)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("==================================================");
                    sb.AppendLine($"[TIMESTAMP]      : {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
                    sb.AppendLine($"[CONTEXT]        : {context}");
                    sb.AppendLine($"[EXCEPTION TYPE] : {ex.GetType().FullName}");
                    sb.AppendLine($"[ERROR CODE]     : {errorCode}");
                    sb.AppendLine($"[ERROR MESSAGE]  : {ex.Message}");
                    sb.AppendLine("[STACK TRACE]    :");
                    sb.AppendLine(ex.StackTrace ?? "No stack trace available.");
                    sb.AppendLine("==================================================");

                    File.AppendAllText(_logFilePath, sb.ToString(), Encoding.UTF8);
                }
            }
            catch { }
        }
    }
}

using System;
using System.IO;
using System.Windows;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using Microsoft.Web.WebView2.Core;
using RotinaActivity.Services;

namespace RotinaActivity
{
    public partial class MainWindow : Window
    {
        private DatabaseService _dbService;
        private Win32ActivityTracker _tracker;
        private LocalWebServer _webServer;
        private DispatcherTimer _activityTimer;

        public MainWindow()
        {
            InitializeComponent();
            SetWindowIconSafely();
            InitializeBackendServices();
            InitializeWebViewAsync();
        }

        private void SetWindowIconSafely()
        {
            try
            {
                string icoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");
                if (File.Exists(icoPath))
                {
                    this.Icon = BitmapFrame.Create(new Uri(icoPath, UriKind.Absolute));
                }
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.SetWindowIconSafely", 502);
            }
        }

        private void InitializeBackendServices()
        {
            try
            {
                _dbService = new DatabaseService();
                _tracker = new Win32ActivityTracker();

                _webServer = new LocalWebServer();
                _webServer.Start(_dbService, 58201);

                // Start 3-second telemetry logger
                _activityTimer = new DispatcherTimer();
                _activityTimer.Interval = TimeSpan.FromSeconds(3);
                _activityTimer.Tick += OnActivityTick;
                _activityTimer.Start();

                LoggerService.LogInfo("Backend Services, WebServer and Realtime Activity Tracker Initialized.");
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.InitializeBackendServices", 503);
            }
        }

        private void OnActivityTick(object sender, EventArgs e)
        {
            try
            {
                var (appName, windowTitle, path) = _tracker.GetActiveWindowDetails();
                uint idleSecs = _tracker.GetIdleTimeSeconds();

                if (string.IsNullOrWhiteSpace(appName)) return;

                string appLower = appName.ToLower();

                // Ignore RotinaActivity self-logging so only external windows opened by the user are tracked
                if (appLower.Contains("rotinaactivity")) return;

                string category = "Geral";
                bool isProductive = true;

                if (appLower.Contains("code") || appLower.Contains("visualstudio") || appLower.Contains("devenv") || appLower.Contains("rider") || appLower.Contains("git") || appLower.Contains("cmd") || appLower.Contains("powershell") || appLower.Contains("terminal"))
                {
                    category = "Desenvolvimento";
                    isProductive = true;
                }
                else if (appLower.Contains("chrome") || appLower.Contains("msedge") || appLower.Contains("firefox") || appLower.Contains("brave"))
                {
                    category = "Navegador";
                    isProductive = true;
                }
                else if (appLower.Contains("figma") || appLower.Contains("photoshop") || appLower.Contains("illustrator"))
                {
                    category = "Design";
                    isProductive = true;
                }
                else if (appLower.Contains("slack") || appLower.Contains("teams") || appLower.Contains("discord") || appLower.Contains("whatsapp"))
                {
                    category = "Comunicação";
                    isProductive = true;
                }
                else if (appLower.Contains("word") || appLower.Contains("excel") || appLower.Contains("obsidian") || appLower.Contains("notepad"))
                {
                    category = "Documentação";
                    isProductive = true;
                }
                else if (appLower.Contains("spotify") || appLower.Contains("steam") || appLower.Contains("netflix") || appLower.Contains("game"))
                {
                    category = "Entretenimento";
                    isProductive = false;
                }

                _dbService?.AddActivity(appName, windowTitle, category, 3, (int)idleSecs, isProductive);
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.OnActivityTick", 507);
            }
        }

        private async void InitializeWebViewAsync()
        {
            try
            {
                // Store WebView2 cache and profile data in LocalAppData to avoid Windows Program Files UAC permission errors
                string appDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "RotinaActivity");
                if (!Directory.Exists(appDataFolder))
                {
                    Directory.CreateDirectory(appDataFolder);
                }
                string userDataFolder = Path.Combine(appDataFolder, "WebView2Data");
                if (!Directory.Exists(userDataFolder))
                {
                    Directory.CreateDirectory(userDataFolder);
                }

                // Configure browser environment with software rendering flags to prevent GPU process crashes turning window black
                var options = new CoreWebView2EnvironmentOptions("--disable-gpu --disable-dev-shm-usage --no-sandbox");
                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder, options);
                await webView.EnsureCoreWebView2Async(env);

                webView.CoreWebView2.Settings.IsWebMessageEnabled = true;
                webView.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = true;
                webView.CoreWebView2.Settings.IsScriptEnabled = true;

                // Handle ProcessFailed event to automatically recover rendering surface
                webView.CoreWebView2.ProcessFailed += (s, args) =>
                {
                    LoggerService.LogInfo($"WebView2 ProcessFailed: {args.ProcessFailedKind}, Reason: {args.Reason}");
                    if (args.ProcessFailedKind == CoreWebView2ProcessFailedKind.RenderProcessUnresponsive ||
                        args.ProcessFailedKind == CoreWebView2ProcessFailedKind.RenderProcessExited)
                    {
                        webView.Reload();
                    }
                };

                // Navigate directly to LocalWebServer to ensure 100% same-origin HTTP requests for UI & API
                webView.Source = new Uri("http://localhost:58201/index.html");
                LoggerService.LogInfo($"WebView2 initialized cleanly at {userDataFolder} and navigated to http://localhost:58201/index.html");
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.InitializeWebViewAsync", 504);
            }
        }

        protected override void OnClosed(EventArgs e)
        {
            _activityTimer?.Stop();
            _webServer?.Stop();
            base.OnClosed(e);
        }
    }
}

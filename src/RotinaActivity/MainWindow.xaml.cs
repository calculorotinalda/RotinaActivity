using System;
using System.IO;
using System.Windows;
using System.Windows.Media.Imaging;
using Microsoft.Web.WebView2.Core;
using RotinaActivity.Services;

namespace RotinaActivity
{
    public partial class MainWindow : Window
    {
        private DatabaseService _dbService;
        private Win32ActivityTracker _tracker;

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
                LoggerService.LogInfo("Backend Database and Win32 Activity Tracker Services Initialized.");
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.InitializeBackendServices", 503);
            }
        }

        private async void InitializeWebViewAsync()
        {
            try
            {
                string userDataFolder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "WebView2Data");
                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
                await webView.EnsureCoreWebView2Async(env);

                string distFolder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist_ui");
                if (Directory.Exists(distFolder))
                {
                    // Map local dist_ui folder directly to virtual host https://app.rotina/ without local webserver
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "app.rotina",
                        distFolder,
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    webView.Source = new Uri("https://app.rotina/index.html");
                    LoggerService.LogInfo("WebView2 virtual host mapped to https://app.rotina/index.html");
                }
                else
                {
                    LoggerService.LogInfo("dist_ui folder not found; displaying fallback interface.");
                }
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "MainWindow.InitializeWebViewAsync", 504);
            }
        }

        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);
        }
    }
}

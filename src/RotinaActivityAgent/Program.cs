using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using RotinaActivity.Services;

namespace RotinaActivityAgent
{
    internal static class Program
    {
        private static NotifyIcon _notifyIcon;
        private static bool _isTrackingPaused = false;
        private static Win32ActivityTracker _tracker;
        private static DatabaseService _dbService;
        private static System.Threading.Timer _monitoringTimer;

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Register Global Exception Handlers
            AppDomain.CurrentDomain.UnhandledException += (s, e) =>
            {
                if (e.ExceptionObject is Exception ex)
                {
                    LoggerService.LogException(ex, "TrayAgent.UnhandledException", 600);
                }
            };

            Application.ThreadException += (s, e) =>
            {
                LoggerService.LogException(e.Exception, "TrayAgent.ThreadException", 601);
            };

            LoggerService.LogInfo("RotinaActivity Tray Agent Executable Started.");

            _dbService = new DatabaseService();
            _tracker = new Win32ActivityTracker();
            InitializeTrayIcon();

            // Start 2-second background activity monitoring loop logging directly to SQLite WAL DB
            _monitoringTimer = new System.Threading.Timer(OnMonitoringTick, null, 1000, 2000);

            Application.Run();
        }

        private static void InitializeTrayIcon()
        {
            try
            {
                _notifyIcon = new NotifyIcon();
                
                string iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");
                if (File.Exists(iconPath))
                {
                    _notifyIcon.Icon = new Icon(iconPath);
                }
                else
                {
                    _notifyIcon.Icon = SystemIcons.Application;
                }

                _notifyIcon.Text = "RotinaActivity Agent - Rastreamento Ativo";
                _notifyIcon.Visible = true;

                ContextMenuStrip menu = new ContextMenuStrip();
                menu.Items.Add("RotinaActivity Ultimate (Agente)", null, (s, e) => OpenMainApp());
                menu.Items.Add(new ToolStripSeparator());
                
                var pauseItem = new ToolStripMenuItem("Pausar Rastreamento", null, (s, e) => TogglePauseTracking());
                menu.Items.Add(pauseItem);

                menu.Items.Add("Ativar Modo Focus", null, (s, e) => ShowNotification("Modo Focus", "Sessão de Deep Work iniciada!"));
                menu.Items.Add("Abrir Dashboard", null, (s, e) => OpenMainApp());
                menu.Items.Add(new ToolStripSeparator());
                menu.Items.Add("Sair", null, (s, e) => ExitAgent());

                _notifyIcon.ContextMenuStrip = menu;
                _notifyIcon.DoubleClick += (s, e) => OpenMainApp();
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "TrayAgent.InitializeTrayIcon", 602);
            }
        }

        private static void OnMonitoringTick(object state)
        {
            if (_isTrackingPaused) return;

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

                _dbService?.AddActivity(appName, windowTitle, category, 2, (int)idleSecs, isProductive);
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "TrayAgent.OnMonitoringTick", 603);
            }
        }

        private static void TogglePauseTracking()
        {
            _isTrackingPaused = !_isTrackingPaused;
            string status = _isTrackingPaused ? "Pausado" : "Ativo";
            _notifyIcon.Text = $"RotinaActivity Agent - {status}";
            ShowNotification("Status de Monitorização", $"Rastreamento de atividade está agora {status.ToLower()}.");
        }

        private static void OpenMainApp()
        {
            try
            {
                string mainExe = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RotinaActivity.exe");
                if (File.Exists(mainExe))
                {
                    Process.Start(new ProcessStartInfo(mainExe) { UseShellExecute = true });
                }
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "TrayAgent.OpenMainApp", 604);
            }
        }

        private static void ShowNotification(string title, string text)
        {
            _notifyIcon.ShowBalloonTip(3000, title, text, ToolTipIcon.Info);
        }

        private static void ExitAgent()
        {
            _monitoringTimer?.Dispose();
            _notifyIcon.Visible = false;
            _notifyIcon.Dispose();
            LoggerService.LogInfo("RotinaActivity Tray Agent Shutdown cleanly.");
            Application.Exit();
        }
    }
}

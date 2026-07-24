using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace RotinaActivity.Services
{
    public class Win32ActivityTracker
    {
        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll")]
        private static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

        [StructLayout(LayoutKind.Sequential)]
        private struct LASTINPUTINFO
        {
            public uint cbSize;
            public uint dwTime;
        }

        public (string appName, string windowTitle, string processPath) GetActiveWindowDetails()
        {
            try
            {
                IntPtr hWnd = GetForegroundWindow();
                if (hWnd == IntPtr.Zero) return ("Desconhecido", "Área de Trabalho", "");

                StringBuilder sb = new StringBuilder(512);
                GetWindowText(hWnd, sb, sb.Capacity);
                string title = sb.ToString();

                GetWindowThreadProcessId(hWnd, out uint processId);
                if (processId == 0) return ("Sistema", title, "");

                Process proc = Process.GetProcessById((int)processId);
                string appName = proc.ProcessName;
                string mainModule = "";
                try { mainModule = proc.MainModule?.FileName ?? ""; } catch { }

                return (appName, string.IsNullOrWhiteSpace(title) ? appName : title, mainModule);
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "Win32ActivityTracker.GetActiveWindowDetails", 502);
                return ("Sistema", "Inconhecido", "");
            }
        }

        public uint GetIdleTimeSeconds()
        {
            try
            {
                LASTINPUTINFO lii = new LASTINPUTINFO();
                lii.cbSize = (uint)Marshal.SizeOf(lii);
                if (GetLastInputInfo(ref lii))
                {
                    uint systemUptime = (uint)Environment.TickCount;
                    uint idleTicks = systemUptime - lii.dwTime;
                    return idleTicks / 1000;
                }
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "Win32ActivityTracker.GetIdleTimeSeconds", 503);
            }
            return 0;
        }
    }
}

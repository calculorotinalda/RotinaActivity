using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RotinaActivity.Services
{
    public class LocalWebServer
    {
        private HttpListener _listener;
        private bool _isRunning;

        public void Start(int port = 58201)
        {
            try
            {
                _listener = new HttpListener();
                _listener.Prefixes.Add($"http://localhost:{port}/");
                _listener.Start();
                _isRunning = true;

                Task.Run(ListenLoop);
                LoggerService.LogInfo($"LocalWebServer running at http://localhost:{port}/");
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "LocalWebServer.Start", 504);
            }
        }

        private async Task ListenLoop()
        {
            while (_isRunning)
            {
                try
                {
                    var context = await _listener.GetContextAsync();
                    ProcessRequest(context);
                }
                catch (Exception ex)
                {
                    if (!_isRunning) break;
                    LoggerService.LogException(ex, "LocalWebServer.ListenLoop", 505);
                }
            }
        }

        private void ProcessRequest(HttpListenerContext context)
        {
            try
            {
                var response = context.Response;
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

                if (context.Request.HttpMethod == "OPTIONS")
                {
                    response.StatusCode = 200;
                    response.Close();
                    return;
                }

                string path = context.Request.Url.AbsolutePath.ToLower();
                string jsonResponse = "{\"status\":\"ok\",\"service\":\"RotinaActivity API\"}";

                if (path == "/api/status")
                {
                    jsonResponse = "{\"status\":\"active\",\"agent\":\"connected\",\"engine\":\"RotinaActivity 1.0.0\"}";
                }

                byte[] buffer = Encoding.UTF8.GetBytes(jsonResponse);
                response.ContentType = "application/json";
                response.ContentLength64 = buffer.Length;
                response.OutputStream.Write(buffer, 0, buffer.Length);
                response.Close();
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "LocalWebServer.ProcessRequest", 506);
            }
        }

        public void Stop()
        {
            _isRunning = false;
            _listener?.Stop();
        }
    }
}

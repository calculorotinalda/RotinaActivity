using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RotinaActivity.Services
{
    public class LocalWebServer
    {
        private HttpListener _listener;
        private bool _isRunning;
        private DatabaseService _dbService;

        public void Start(DatabaseService dbService, int port = 58201)
        {
            _dbService = dbService;
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
                response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

                if (context.Request.HttpMethod == "OPTIONS")
                {
                    response.StatusCode = 200;
                    response.Close();
                    return;
                }

                string rawPath = context.Request.Url.AbsolutePath;
                string path = rawPath.ToLower();

                if (path.StartsWith("/api/"))
                {
                    string jsonResponse = "{\"status\":\"ok\",\"service\":\"RotinaActivity API\"}";

                    if (path == "/api/activities")
                    {
                        jsonResponse = _dbService?.GetActivitiesJson() ?? "[]";
                    }
                    else if (path == "/api/score")
                    {
                        jsonResponse = _dbService?.GetScoreJson() ?? "{\"score\":0,\"focusScore\":0,\"consistencyScore\":0,\"contextSwitches\":0,\"interruptionCount\":0,\"workRestRatio\":\"0% / 0%\"}";
                    }
                    else if (path == "/api/metrics")
                    {
                        double ramMb = 86.4;
                        try
                        {
                            var proc = Process.GetCurrentProcess();
                            ramMb = Math.Round(proc.WorkingSet64 / (1024.0 * 1024.0), 1);
                        }
                        catch { }

                        jsonResponse = JsonSerializer.Serialize(new
                        {
                            cpuPercent = 1.5,
                            ramUsageMb = ramMb,
                            ramTotalMb = 16384,
                            gpuPercent = 3.2,
                            diskPercent = 24.5,
                            networkKbps = 80.0,
                            batteryPercent = 100
                        });
                    }
                    else if (path == "/api/goals")
                    {
                        if (context.Request.HttpMethod == "POST")
                        {
                            using var reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding);
                            string body = reader.ReadToEnd();
                            using var doc = JsonDocument.Parse(body);
                            var root = doc.RootElement;

                            string id = root.TryGetProperty("id", out var pId) ? pId.GetString() : Guid.NewGuid().ToString("N");
                            string title = root.TryGetProperty("title", out var pT) ? pT.GetString() : "Nova Meta";
                            int target = root.TryGetProperty("targetMinutes", out var pTarget) ? pTarget.GetInt32() : 60;
                            int current = root.TryGetProperty("currentMinutes", out var pCur) ? pCur.GetInt32() : 0;
                            string type = root.TryGetProperty("type", out var pType) ? pType.GetString() : "daily";
                            string cat = root.TryGetProperty("category", out var pCat) ? pCat.GetString() : "Geral";
                            bool isComp = root.TryGetProperty("isCompleted", out var pComp) && pComp.GetBoolean();

                            _dbService?.AddGoal(id, title, target, current, type, cat, isComp);
                            jsonResponse = "{\"status\":\"success\"}";
                        }
                        else
                        {
                            jsonResponse = _dbService?.GetGoalsJson() ?? "[]";
                        }
                    }
                    else if (path == "/api/rules")
                    {
                        if (context.Request.HttpMethod == "POST")
                        {
                            using var reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding);
                            string body = reader.ReadToEnd();
                            using var doc = JsonDocument.Parse(body);
                            var root = doc.RootElement;

                            string id = root.TryGetProperty("id", out var pId) ? pId.GetString() : Guid.NewGuid().ToString("N");
                            string name = root.TryGetProperty("name", out var pName) ? pName.GetString() : "Nova Regra";
                            string cond = root.TryGetProperty("conditionIf", out var pCond) ? pCond.GetString() : "";
                            string act = root.TryGetProperty("actionThen", out var pAct) ? pAct.GetString() : "";
                            bool active = !root.TryGetProperty("isActive", out var pActv) || pActv.GetBoolean();

                            _dbService?.AddRule(id, name, cond, act, active);
                            jsonResponse = "{\"status\":\"success\"}";
                        }
                        else if (context.Request.HttpMethod == "DELETE")
                        {
                            string id = context.Request.QueryString["id"] ?? "";
                            if (!string.IsNullOrEmpty(id))
                            {
                                _dbService?.DeleteRule(id);
                            }
                            jsonResponse = "{\"status\":\"success\"}";
                        }
                        else
                        {
                            jsonResponse = _dbService?.GetRulesJson() ?? "[]";
                        }
                    }
                    else if (path == "/api/rules/toggle")
                    {
                        using var reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding);
                        string body = reader.ReadToEnd();
                        using var doc = JsonDocument.Parse(body);
                        var root = doc.RootElement;

                        string id = root.TryGetProperty("id", out var pId) ? pId.GetString() : "";
                        bool active = root.TryGetProperty("isActive", out var pActv) && pActv.GetBoolean();

                        if (!string.IsNullOrEmpty(id))
                        {
                            _dbService?.ToggleRule(id, active);
                        }
                        jsonResponse = "{\"status\":\"success\"}";
                    }
                    else if (path == "/api/projects")
                    {
                        jsonResponse = _dbService?.GetProjectsJson() ?? "[]";
                    }
                    else if (path == "/api/insights")
                    {
                        jsonResponse = _dbService?.GetInsightsJson() ?? "[]";
                    }
                    else if (path == "/api/clear-db" || path == "/api/clear")
                    {
                        _dbService?.ClearAllData();
                        jsonResponse = "{\"status\":\"success\",\"message\":\"Base de dados limpa com sucesso.\"}";
                    }
                    else if (path == "/api/status")
                    {
                        jsonResponse = "{\"status\":\"active\",\"agent\":\"connected\",\"engine\":\"RotinaActivity 1.0.0\"}";
                    }

                    byte[] buffer = Encoding.UTF8.GetBytes(jsonResponse);
                    response.ContentType = "application/json";
                    response.ContentLength64 = buffer.Length;
                    response.OutputStream.Write(buffer, 0, buffer.Length);
                    response.Close();
                    return;
                }

                // Serve static dist_ui files fallback
                string distFolder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist_ui");
                if (!Directory.Exists(distFolder))
                {
                    distFolder = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "dist_ui"));
                }

                string relativePath = rawPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                if (string.IsNullOrWhiteSpace(relativePath)) relativePath = "index.html";

                string filePath = Path.Combine(distFolder, relativePath);

                if (!File.Exists(filePath))
                {
                    filePath = Path.Combine(distFolder, "index.html");
                }

                if (File.Exists(filePath))
                {
                    byte[] fileBytes = File.ReadAllBytes(filePath);
                    string ext = Path.GetExtension(filePath).ToLower();
                    string contentType = "text/html";
                    if (ext == ".js") contentType = "text/javascript";
                    else if (ext == ".css") contentType = "text/css";
                    else if (ext == ".png") contentType = "image/png";
                    else if (ext == ".ico") contentType = "image/x-icon";
                    else if (ext == ".json") contentType = "application/json";
                    else if (ext == ".svg") contentType = "image/svg+xml";

                    response.ContentType = contentType;
                    response.ContentLength64 = fileBytes.Length;
                    response.OutputStream.Write(fileBytes, 0, fileBytes.Length);
                    response.Close();
                    return;
                }

                response.StatusCode = 404;
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

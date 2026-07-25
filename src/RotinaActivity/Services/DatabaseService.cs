using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using Microsoft.Data.Sqlite;

namespace RotinaActivity.Services
{
    public class DatabaseService
    {
        private readonly string _dbPath;
        private readonly string _connectionString;
        private readonly object _dbLock = new object();

        public DatabaseService()
        {
            string appDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "RotinaActivity");
            if (!Directory.Exists(appDataFolder))
            {
                Directory.CreateDirectory(appDataFolder);
            }
            _dbPath = Path.Combine(appDataFolder, "rotina_activity.db");
            _connectionString = $"Data Source={_dbPath};Mode=ReadWriteCreate;";
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=5000;";
                        cmd.ExecuteNonQuery();
                    }

                    string createTableQuery = @"
                        CREATE TABLE IF NOT EXISTS activities (
                            id TEXT PRIMARY KEY,
                            timestamp TEXT NOT NULL,
                            app_name TEXT NOT NULL,
                            window_title TEXT NOT NULL,
                            browser_url TEXT,
                            category TEXT NOT NULL,
                            duration_seconds INTEGER NOT NULL,
                            idle_seconds INTEGER NOT NULL,
                            is_productive INTEGER NOT NULL,
                            project TEXT,
                            client TEXT,
                            cpu_usage REAL,
                            ram_usage REAL
                        );
                        CREATE TABLE IF NOT EXISTS goals (
                            id TEXT PRIMARY KEY,
                            title TEXT NOT NULL,
                            target_minutes INTEGER NOT NULL,
                            current_minutes INTEGER NOT NULL,
                            type TEXT NOT NULL,
                            category TEXT NOT NULL,
                            is_completed INTEGER NOT NULL
                        );
                        CREATE TABLE IF NOT EXISTS automation_rules (
                            id TEXT PRIMARY KEY,
                            name TEXT NOT NULL,
                            condition_if TEXT NOT NULL,
                            action_then TEXT NOT NULL,
                            is_active INTEGER NOT NULL
                        );
                        CREATE TABLE IF NOT EXISTS projects (
                            id TEXT PRIMARY KEY,
                            name TEXT NOT NULL,
                            client TEXT NOT NULL,
                            hourly_rate REAL NOT NULL,
                            billable_hours REAL NOT NULL,
                            non_billable_hours REAL NOT NULL,
                            budget REAL NOT NULL
                        );
                        CREATE TABLE IF NOT EXISTS ai_insights (
                            id TEXT PRIMARY KEY,
                            title TEXT NOT NULL,
                            description TEXT NOT NULL,
                            category TEXT NOT NULL,
                            confidence_score INTEGER NOT NULL,
                            timestamp TEXT NOT NULL
                        );
                    ";

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = createTableQuery;
                        cmd.ExecuteNonQuery();
                    }

                    // Purge legacy self-referential RotinaActivity entries
                    using (var purgeCmd = conn.CreateCommand())
                    {
                        purgeCmd.CommandText = "DELETE FROM activities WHERE LOWER(app_name) LIKE '%rotinaactivity%';";
                        purgeCmd.ExecuteNonQuery();
                    }

                    LoggerService.LogInfo($"Database Service Initialized cleanly at {_dbPath} with SQLite WAL Mode.");
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.InitializeDatabase", 501);
                }
            }
        }

        public void AddActivity(string appName, string windowTitle, string category, int durationSecs, int idleSecs, bool isProductive, string project = null, string client = null, double cpu = 0, double ram = 0)
        {
            if (string.IsNullOrWhiteSpace(appName)) return;

            // Ignore self-referential app activity
            string appLower = appName.ToLower();
            if (appLower.Contains("rotinaactivity")) return;

            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    // Check last activity session to aggregate continuous window usage into a single session
                    using var checkCmd = conn.CreateCommand();
                    checkCmd.CommandText = "SELECT id, app_name, window_title, duration_seconds FROM activities ORDER BY rowid DESC LIMIT 1";

                    using (var reader = checkCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string lastId = reader.GetString(0);
                            string lastApp = reader.GetString(1);
                            string lastTitle = reader.GetString(2);
                            int lastDuration = reader.GetInt32(3);

                            if (string.Equals(lastApp, appName, StringComparison.OrdinalIgnoreCase) &&
                                string.Equals(lastTitle, windowTitle, StringComparison.OrdinalIgnoreCase))
                            {
                                reader.Close();
                                using var updateCmd = conn.CreateCommand();
                                updateCmd.CommandText = "UPDATE activities SET duration_seconds = @newDuration, idle_seconds = @idle, timestamp = @timestamp WHERE id = @id";
                                updateCmd.Parameters.AddWithValue("@newDuration", lastDuration + durationSecs);
                                updateCmd.Parameters.AddWithValue("@idle", idleSecs);
                                updateCmd.Parameters.AddWithValue("@timestamp", DateTime.Now.ToString("HH:mm:ss"));
                                updateCmd.Parameters.AddWithValue("@id", lastId);
                                updateCmd.ExecuteNonQuery();
                                return;
                            }
                        }
                    }

                    // Insert new session when user switches to a different active window
                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = @"
                        INSERT INTO activities (id, timestamp, app_name, window_title, browser_url, category, duration_seconds, idle_seconds, is_productive, project, client, cpu_usage, ram_usage)
                        VALUES (@id, @timestamp, @appName, @windowTitle, @browserUrl, @category, @duration, @idle, @isProductive, @project, @client, @cpu, @ram)
                    ";
                    cmd.Parameters.AddWithValue("@id", Guid.NewGuid().ToString("N"));
                    cmd.Parameters.AddWithValue("@timestamp", DateTime.Now.ToString("HH:mm:ss"));
                    cmd.Parameters.AddWithValue("@appName", appName);
                    cmd.Parameters.AddWithValue("@windowTitle", string.IsNullOrWhiteSpace(windowTitle) ? appName : windowTitle);
                    cmd.Parameters.AddWithValue("@browserUrl", (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@category", category ?? "Geral");
                    cmd.Parameters.AddWithValue("@duration", durationSecs);
                    cmd.Parameters.AddWithValue("@idle", idleSecs);
                    cmd.Parameters.AddWithValue("@isProductive", isProductive ? 1 : 0);
                    cmd.Parameters.AddWithValue("@project", (object)project ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@client", (object)client ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@cpu", cpu);
                    cmd.Parameters.AddWithValue("@ram", ram);

                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.AddActivity", 510);
                }
            }
        }

        public string GetActivitiesJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT id, timestamp, app_name, window_title, browser_url, category, duration_seconds, idle_seconds, is_productive, project, client, cpu_usage, ram_usage FROM activities WHERE LOWER(app_name) NOT LIKE '%rotinaactivity%' ORDER BY rowid DESC LIMIT 100";

                    using var reader = cmd.ExecuteReader();
                    var list = new List<object>();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            id = reader.GetString(0),
                            timestamp = reader.GetString(1),
                            appName = reader.GetString(2),
                            windowTitle = reader.GetString(3),
                            browserUrl = reader.IsDBNull(4) ? null : reader.GetString(4),
                            category = reader.GetString(5),
                            durationSeconds = reader.GetInt32(6),
                            idleSeconds = reader.GetInt32(7),
                            isProductive = reader.GetInt32(8) == 1,
                            project = reader.IsDBNull(9) ? null : reader.GetString(9),
                            client = reader.IsDBNull(10) ? null : reader.GetString(10),
                            cpuUsage = reader.IsDBNull(11) ? 0.0 : reader.GetDouble(11),
                            ramUsage = reader.IsDBNull(12) ? 0.0 : reader.GetDouble(12)
                        });
                    }
                    return JsonSerializer.Serialize(list);
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetActivitiesJson", 511);
                    return "[]";
                }
            }
        }

        public string GetScoreJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT COUNT(*), SUM(CASE WHEN is_productive = 1 THEN 1 ELSE 0 END) FROM activities WHERE LOWER(app_name) NOT LIKE '%rotinaactivity%'";

                    using var reader = cmd.ExecuteReader();
                    int total = 0;
                    int productive = 0;
                    if (reader.Read())
                    {
                        total = reader.GetInt32(0);
                        productive = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                    }

                    if (total == 0)
                    {
                        return JsonSerializer.Serialize(new
                        {
                            score = 0,
                            focusScore = 0,
                            consistencyScore = 0,
                            contextSwitches = 0,
                            interruptionCount = 0,
                            workRestRatio = "0% / 0%"
                        });
                    }

                    int scoreVal = (int)Math.Round((double)productive / total * 100);
                    return JsonSerializer.Serialize(new
                    {
                        score = scoreVal,
                        focusScore = Math.Min(100, scoreVal + 5),
                        consistencyScore = Math.Max(0, scoreVal - 5),
                        contextSwitches = Math.Max(0, total - productive),
                        interruptionCount = 0,
                        workRestRatio = $"{scoreVal}% / {100 - scoreVal}%"
                    });
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetScoreJson", 512);
                    return "{\"score\":0,\"focusScore\":0,\"consistencyScore\":0,\"contextSwitches\":0,\"interruptionCount\":0,\"workRestRatio\":\"0% / 0%\"}";
                }
            }
        }

        public string GetGoalsJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT id, title, target_minutes, current_minutes, type, category, is_completed FROM goals";

                    using var reader = cmd.ExecuteReader();
                    var list = new List<object>();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            id = reader.GetString(0),
                            title = reader.GetString(1),
                            targetMinutes = reader.GetInt32(2),
                            currentMinutes = reader.GetInt32(3),
                            type = reader.GetString(4),
                            category = reader.GetString(5),
                            isCompleted = reader.GetInt32(6) == 1
                        });
                    }
                    return JsonSerializer.Serialize(list);
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetGoalsJson", 513);
                    return "[]";
                }
            }
        }

        public void AddGoal(string id, string title, int targetMinutes, int currentMinutes, string type, string category, bool isCompleted)
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = @"
                        INSERT OR REPLACE INTO goals (id, title, target_minutes, current_minutes, type, category, is_completed)
                        VALUES (@id, @title, @targetMinutes, @currentMinutes, @type, @category, @isCompleted)
                    ";
                    cmd.Parameters.AddWithValue("@id", string.IsNullOrWhiteSpace(id) ? Guid.NewGuid().ToString("N") : id);
                    cmd.Parameters.AddWithValue("@title", title ?? "Nova Meta");
                    cmd.Parameters.AddWithValue("@targetMinutes", targetMinutes);
                    cmd.Parameters.AddWithValue("@currentMinutes", currentMinutes);
                    cmd.Parameters.AddWithValue("@type", type ?? "daily");
                    cmd.Parameters.AddWithValue("@category", category ?? "Geral");
                    cmd.Parameters.AddWithValue("@isCompleted", isCompleted ? 1 : 0);

                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.AddGoal", 521);
                }
            }
        }

        public string GetRulesJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT id, name, condition_if, action_then, is_active FROM automation_rules";

                    using var reader = cmd.ExecuteReader();
                    var list = new List<object>();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            id = reader.GetString(0),
                            name = reader.GetString(1),
                            conditionIf = reader.GetString(2),
                            actionThen = reader.GetString(3),
                            isActive = reader.GetInt32(4) == 1
                        });
                    }
                    return JsonSerializer.Serialize(list);
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetRulesJson", 514);
                    return "[]";
                }
            }
        }

        public void AddRule(string id, string name, string conditionIf, string actionThen, bool isActive)
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = @"
                        INSERT OR REPLACE INTO automation_rules (id, name, condition_if, action_then, is_active)
                        VALUES (@id, @name, @conditionIf, @actionThen, @isActive)
                    ";
                    cmd.Parameters.AddWithValue("@id", string.IsNullOrWhiteSpace(id) ? Guid.NewGuid().ToString("N") : id);
                    cmd.Parameters.AddWithValue("@name", name ?? "Nova Regra");
                    cmd.Parameters.AddWithValue("@conditionIf", conditionIf ?? "");
                    cmd.Parameters.AddWithValue("@actionThen", actionThen ?? "");
                    cmd.Parameters.AddWithValue("@isActive", isActive ? 1 : 0);

                    cmd.ExecuteNonQuery();
                    LoggerService.LogInfo($"Database Service: Automation Rule '{name}' saved successfully.");
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.AddRule", 518);
                }
            }
        }

        public void ToggleRule(string id, bool isActive)
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "UPDATE automation_rules SET is_active = @isActive WHERE id = @id";
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@isActive", isActive ? 1 : 0);

                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.ToggleRule", 519);
                }
            }
        }

        public void DeleteRule(string id)
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "DELETE FROM automation_rules WHERE id = @id";
                    cmd.Parameters.AddWithValue("@id", id);

                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.DeleteRule", 520);
                }
            }
        }

        public string GetProjectsJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT id, name, client, hourly_rate, billable_hours, non_billable_hours, budget FROM projects";

                    using var reader = cmd.ExecuteReader();
                    var list = new List<object>();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            id = reader.GetString(0),
                            name = reader.GetString(1),
                            client = reader.GetString(2),
                            hourlyRate = reader.GetDouble(3),
                            billableHours = reader.GetDouble(4),
                            nonBillableHours = reader.GetDouble(5),
                            budget = reader.GetDouble(6)
                        });
                    }
                    return JsonSerializer.Serialize(list);
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetProjectsJson", 515);
                    return "[]";
                }
            }
        }

        public string GetInsightsJson()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT id, title, description, category, confidence_score, timestamp FROM ai_insights";

                    using var reader = cmd.ExecuteReader();
                    var list = new List<object>();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            id = reader.GetString(0),
                            title = reader.GetString(1),
                            description = reader.GetString(2),
                            category = reader.GetString(3),
                            confidenceScore = reader.GetInt32(4),
                            timestamp = reader.GetString(5)
                        });
                    }
                    return JsonSerializer.Serialize(list);
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.GetInsightsJson", 516);
                    return "[]";
                }
            }
        }

        public void ClearAllData()
        {
            lock (_dbLock)
            {
                try
                {
                    using var conn = new SqliteConnection(_connectionString);
                    conn.Open();

                    using var cmd = conn.CreateCommand();
                    cmd.CommandText = @"
                        DELETE FROM activities;
                        DELETE FROM goals;
                        DELETE FROM automation_rules;
                        DELETE FROM projects;
                        DELETE FROM ai_insights;
                    ";
                    cmd.ExecuteNonQuery();
                    LoggerService.LogInfo("Database Service: Clean production state enforced. All tables purged.");
                }
                catch (Exception ex)
                {
                    LoggerService.LogException(ex, "DatabaseService.ClearAllData", 517);
                }
            }
        }
    }
}

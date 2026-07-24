using System;
using System.IO;
using Microsoft.Data.Sqlite;
using RotinaActivity.Services;

namespace RotinaActivity.Services
{
    public class DatabaseService
    {
        private readonly string _dbPath;
        private readonly string _connectionString;

        public DatabaseService()
        {
            _dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "rotina_activity.db");
            _connectionString = $"Data Source={_dbPath}";
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            try
            {
                using var conn = new SqliteConnection(_connectionString);
                conn.Open();

                // Enable PRAGMA WAL mode for high performance
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;";
                    cmd.ExecuteNonQuery();
                }

                // Create Activities Table
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
                ";

                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = createTableQuery;
                    cmd.ExecuteNonQuery();
                }

                LoggerService.LogInfo("Database Service Initialized with SQLite WAL Mode.");
            }
            catch (Exception ex)
            {
                LoggerService.LogException(ex, "DatabaseService.InitializeDatabase", 501);
            }
        }
    }
}

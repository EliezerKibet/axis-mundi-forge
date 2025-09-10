// server.js - Simple connection test setup
const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

// Simple external database connection
const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT NOW(), current_database(), version()"
    );

    console.log("✅ Connected to external database!");
    console.log("📊 Database:", result.rows[0].current_database);
    console.log("🕐 Time:", result.rows[0].now);
    console.log("📋 Version:", result.rows[0].version.split(" ")[0]);

    client.release();
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    return false;
  }
}

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT NOW() as time, current_database() as db"
    );
    client.release();

    res.json({
      status: "OK",
      connected: true,
      database: result.rows[0].db,
      timestamp: result.rows[0].time,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      connected: false,
      error: error.message,
    });
  }
});

// Test query endpoint
app.get("/test-query", async (req, res) => {
  try {
    const client = await pool.connect();

    // Get basic database info
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as connected_user,
        version() as postgres_version
    `);

    // List all tables
    const tables = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    client.release();

    res.json({
      success: true,
      database_info: dbInfo.rows[0],
      tables: tables.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Simple data test (if you have an articles table)
app.get("/test-data", async (req, res) => {
  try {
    const client = await pool.connect();

    // Try to query a common table name
    let result;
    try {
      result = await client.query(
        "SELECT COUNT(*) as count FROM articles LIMIT 5"
      );
    } catch (error) {
      // If articles table doesn't exist, try other common names
      try {
        result = await client.query(
          "SELECT COUNT(*) as count FROM posts LIMIT 5"
        );
      } catch (error2) {
        result = { rows: [{ count: "No articles/posts table found" }] };
      }
    }

    client.release();

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
async function startServer() {
  const PORT = process.env.PORT || 3001;

  console.log("🔄 Testing database connection...");
  const connected = await testConnection();

  if (!connected) {
    console.error("❌ Cannot start server - database connection failed");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Test endpoints:`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Query:  http://localhost:${PORT}/test-query`);
    console.log(`   Data:   http://localhost:${PORT}/test-data`);
  });
}

startServer();

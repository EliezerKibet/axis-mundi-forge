const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8080", //front end url
      "http://localhost:3000",
      "https://axismunditech.com",
      "http://localhost:5173",
      "http://127.0.0.1:8080",
    ],
    credentials: true,
  })
);

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

//article structure
app.get("/test/articles-structure", async (req, res) => {
  try {
    const client = await pool.connect();

    const structureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'articles' 
        AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    const structure = await client.query(structureQuery);

    // Check indexes
    const indexQuery = `
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'articles'
        AND schemaname = 'public'
    `;

    const indexes = await client.query(indexQuery);

    client.release();

    res.json({
      success: true,
      articles_table: {
        columns: structure.rows,
        indexes: indexes.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//article data
app.get("/test/articles-data", async (req, res) => {
  try {
    const client = await pool.connect();

    // Count total articles
    const countQuery = `SELECT COUNT(*) as total FROM articles`;
    const countResult = await client.query(countQuery);

    // Get sample articles
    const sampleQuery = `
      SELECT 
        id, 
        title, 
        category, 
        author, 
        published_date, 
        is_active,
        length(content) as content_length,
        length(summary) as summary_length
      FROM articles 
      ORDER BY published_date DESC 
      LIMIT 5
    `;

    const sampleResult = await client.query(sampleQuery);

    // Check metadata structure
    const metadataQuery = `
      SELECT 
        id,
        title,
        metadata
      FROM articles 
      WHERE metadata IS NOT NULL
      LIMIT 3
    `;

    const metadataResult = await client.query(metadataQuery);

    client.release();

    res.json({
      success: true,
      data_status: {
        total_articles: countResult.rows[0].total,
        sample_articles: sampleResult.rows,
        metadata_examples: metadataResult.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//search query
app.get("/test/fulltext-search", async (req, res) => {
  try {
    const { query = "quantum" } = req.query;
    const client = await pool.connect();

    // Test full-text search using tsv column
    const searchQuery = `
      SELECT 
        id,
        title,
        category,
        ts_rank(tsv, plainto_tsquery('english', $1)) as rank
      FROM articles
      WHERE tsv @@ plainto_tsquery('english', $1)
        AND is_active = true
      ORDER BY rank DESC
      LIMIT 5
    `;

    const searchResult = await client.query(searchQuery, [query]);

    client.release();

    res.json({
      success: true,
      search_test: {
        query: query,
        results_found: searchResult.rows.length,
        results: searchResult.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      note: "This might fail if tsv column doesn't exist or full-text search isn't set up",
    });
  }
});

//what front end will show
app.get("/api/articles", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const client = await pool.connect();

    let query = `
      SELECT 
        id,
        title,
        summary as excerpt,
        content,
        category,
        author,
        published_date as "publishDate",
        published_date as date,
        summary as preview,
        '5 min' as "readTime",
        '5' as "readingTime",
        COALESCE((metadata->>'tags')::jsonb, '[]'::jsonb) as tags,
        LOWER(REPLACE(title, ' ', '-')) as slug,
        metadata->>'featuredImage' as "featuredImage",
        CASE 
          WHEN is_active = true THEN 'published'
          ELSE 'draft'
        END as status,
        metadata
      FROM articles 
      WHERE is_active = true
    `;

    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY published_date DESC`;

    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await client.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM articles WHERE is_active = true`;
    const countParams = [];

    if (category) {
      countQuery += ` AND category = $1`;
      countParams.push(category);
    }

    const countResult = await client.query(countQuery, countParams);

    client.release();

    res.json({
      articles: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch articles",
      details: error.message,
    });
  }
});

//test schema
app.get("/test/schema", async (req, res) => {
  try {
    const client = await pool.connect();

    // Check if required tables exist
    const tablesQuery = `
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
        AND table_name IN ('articles', 'article_embeddings', 'system_config', 'user_queries')
      ORDER BY table_name
    `;

    const tables = await client.query(tablesQuery);

    // Check if required extensions exist
    const extensionsQuery = `
      SELECT extname 
      FROM pg_extension 
      WHERE extname IN ('vector', 'pgcrypto')
    `;

    const extensions = await client.query(extensionsQuery);

    // Check if function exists
    const functionQuery = `
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_name = 'get_articles_for_query'
        AND routine_schema = 'public'
    `;

    const functions = await client.query(functionQuery);

    client.release();

    res.json({
      success: true,
      schema_status: {
        tables: tables.rows,
        tables_found: tables.rows.length,
        tables_expected: 4,
        extensions: extensions.rows,
        extensions_found: extensions.rows.length,
        extensions_expected: 2,
        functions: functions.rows,
        functions_found: functions.rows.length,
        functions_expected: 1,
      },
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

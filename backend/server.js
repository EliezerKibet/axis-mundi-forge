const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // for serving static files

// Articles directory path
const ARTICLES_DIR = path.join(__dirname, 'articles');

// Ensure articles directory exists
async function ensureArticlesDir() {
  try {
    await fs.access(ARTICLES_DIR);
  } catch {
    await fs.mkdir(ARTICLES_DIR, { recursive: true });
    console.log('Articles directory created');
  }
}

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const articles = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(ARTICLES_DIR, file);
          const content = await fs.readFile(filePath, 'utf8');
          const article = JSON.parse(content);
          
          // Add file info
          article.filename = file;
          article.id = path.basename(file, '.json');
          
          articles.push(article);
        } catch (err) {
          console.error(`Error reading article ${file}:`, err.message);
        }
      }
    }
    
    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0));
    
    res.json({
      success: true,
      count: articles.length,
      articles: articles
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch articles',
      message: err.message 
    });
  }
});

// Get single article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const filePath = path.join(ARTICLES_DIR, `${articleId}.json`);
    
    const content = await fs.readFile(filePath, 'utf8');
    const article = JSON.parse(content);
    
    article.id = articleId;
    article.filename = `${articleId}.json`;
    
    res.json({
      success: true,
      article: article
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ 
        success: false, 
        error: 'Article not found' 
      });
    } else {
      console.error('Error fetching article:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch article',
        message: err.message 
      });
    }
  }
});

// Create new article (for n8n to POST to)
app.post('/api/articles', async (req, res) => {
  try {
    const article = req.body;
    
    // Generate filename based on title or timestamp
    const timestamp = Date.now();
    const slugTitle = article.title 
      ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : 'article';
    
    const filename = `${timestamp}-${slugTitle}.json`;
    const filePath = path.join(ARTICLES_DIR, filename);
    
    // Add metadata
    const articleData = {
      ...article,
      created_at: new Date().toISOString(),
      filename: filename,
      id: path.basename(filename, '.json')
    };
    
    await fs.writeFile(filePath, JSON.stringify(articleData, null, 2), 'utf8');
    
    console.log(`New article saved: ${filename}`);
    
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article: articleData
    });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create article',
      message: err.message 
    });
  }
});

// Delete article (optional)
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const filePath = path.join(ARTICLES_DIR, `${articleId}.json`);
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ 
        success: false, 
        error: 'Article not found' 
      });
    } else {
      console.error('Error deleting article:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete article',
        message: err.message 
      });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, async () => {
  await ensureArticlesDir();
  console.log(`Server running on port ${PORT}`);
  console.log(`Articles API available at:`);
  console.log(`  GET  /api/articles     - Get all articles`);
  console.log(`  GET  /api/articles/:id - Get single article`);
  console.log(`  POST /api/articles     - Create new article`);
  console.log(`  DEL  /api/articles/:id - Delete article`);
});

module.exports = app;
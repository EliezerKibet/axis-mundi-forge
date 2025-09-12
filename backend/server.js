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

// all articles
app.post('/api/articles', async (req, res) => {
  try {
    const requestData = req.body;
    let articles = [];
    
    // Handle both single article and array of articles
    if (Array.isArray(requestData)) {
      // Direct array of articles
      articles = requestData;
    } else if (requestData.articles && Array.isArray(requestData.articles)) {
      // Object with articles property
      articles = requestData.articles;
    } else if (requestData.title) {
      // Single article object
      articles = [requestData];
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }
    
    const savedArticles = [];
    
    for (const article of articles) {
      // Generate unique filename for each article
      const timestamp = Date.now() + Math.random(); // Add randomness to avoid duplicates
      const slugTitle = article.title 
        ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : 'article';
      
      const filename = `${Math.floor(timestamp * 1000)}-${slugTitle}.json`;
      const filePath = path.join(ARTICLES_DIR, filename);
      
      // Add metadata
      const articleData = {
        ...article,
        created_at: new Date().toISOString(),
        filename: filename,
        id: path.basename(filename, '.json')
      };
      
      await fs.writeFile(filePath, JSON.stringify(articleData, null, 2), 'utf8');
      savedArticles.push(articleData);
      
      console.log(`Article saved: ${filename}`);
    }
    
    res.status(201).json({
      success: true,
      message: `${savedArticles.length} article(s) created successfully`,
      articles: savedArticles,
      count: savedArticles.length
    });
  } catch (err) {
    console.error('Error creating articles:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create articles',
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
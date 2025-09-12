const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Shared subject to send data for webhook2 and webhook3
function formatForN8n(data) {
  return {
    Name: data.name,
    Email: data.email,
    Subject: data.subject,
    Message: data.message,
    Interest: data.interest,
    timestamp: new Date().toISOString()
  };
}

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
    const skippedArticles = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      // Create slug for checking duplicates
      const slugTitle = article.title 
        ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : 'article';
      
      // Check if article already exists by looking for similar filenames
      try {
        const existingFiles = await fs.readdir(ARTICLES_DIR);
        const exists = existingFiles.some(file => 
          file.includes(slugTitle) && file.endsWith('.json')
        );
        
        if (exists) {
          console.log(`Skipping duplicate article: ${article.title}`);
          skippedArticles.push(article.title);
          continue; // Skip this article
        }
      } catch (readError) {
        // If articles directory doesn't exist, create it
        console.log('Articles directory not found, will be created');
      }
      
      // Generate unique filename for new articles
      const timestamp = Date.now() + (i * 1000);
      const filename = `${timestamp}-${slugTitle}.json`;
      const filePath = path.join(ARTICLES_DIR, filename);
      
      // Add metadata
      const articleData = {
        ...article,
        created_at: new Date(timestamp).toISOString(),
        filename: filename,
        id: path.basename(filename, '.json')
      };
      
      await fs.writeFile(filePath, JSON.stringify(articleData, null, 2), 'utf8');
      savedArticles.push(articleData);
      
      console.log(`Article saved: ${filename}`);
    }

    // Update the response to include skipped articles info
    res.status(201).json({
      success: true,
      message: `${savedArticles.length} new article(s) created, ${skippedArticles.length} duplicates skipped`,
      articles: savedArticles,
      skipped: skippedArticles,
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

//Webhook 2 contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, interest } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message || !interest) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Prepare data for n8n webhook (matching the expected format)
    const formDataObj = {
      ...formatForN8n({ name, email, subject, message, interest })
    };

    // Forward to n8n webhook
    const n8nResponse = await fetch(
      "https://n8n-service-bmex.onrender.com/webhook/Form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      }
    );

    if (n8nResponse.ok) {
      const webhookResult = await n8nResponse.json();
      
      console.log("✅ Contact form submitted successfully:", {
        timestamp: new Date().toISOString(),
        formData: formDataObj,
        n8nStatus: n8nResponse.status,
        webhookResponse: webhookResult
      });

      // Return response based on n8n webhook result
      res.json({
        success: true,
        message: 'Contact form submitted successfully',
        status: webhookResult.status || 'ok',
        showSubscribePrompt: webhookResult.showSubscribePrompt || true,
        userData: {
          name: name,
          email: email,
          interest: interest
        },
        recommended: webhookResult.recommended || {
          name: name,
          email: email,
          interest: interest
        }
      });
    } else {
      console.error("❌ n8n webhook failed:", n8nResponse.status);
      res.status(500).json({
        success: false,
        error: 'Failed to process contact form'
      });
    }

  } catch (error) {
    console.error("❌ Contact form submission failed:", error);
    res.status(500).json({
      success: false,
      error: 'Network error occurred'
    });
  }
});

//Webhook 3 webhook susbscribe
app.post('/api/subscribe', async (req, res) => {
  try {
    const { name, email, interest, subscribed } = req.body;
    
    // Basic validation
    if (!name || !email || !interest || typeof subscribed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Name, email, interest, and subscribed status are required'
      });
    }

    // Prepare data for n8n subscription webhook (matching expected format)
    const subscriptionData = {
      ...formatForN8n({name, email, interest }), 
      Subscribed: subscribed
    };

    // Forward to n8n subscription webhook
    const n8nResponse = await fetch(
      "https://n8n-service-bmex.onrender.com/webhook/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic YWRtaW46YWRtaW4=",
          "cors": "true"
        },
        body: JSON.stringify(subscriptionData),
      }
    );

    if (n8nResponse.ok) {
      const webhookResult = await n8nResponse.json();
      
      console.log("✅ Subscription webhook sent successfully:", {
        timestamp: new Date().toISOString(),
        subscriptionData: subscriptionData,
        n8nStatus: n8nResponse.status,
        webhookResponse: webhookResult
      });

      // Return response based on n8n webhook result
      res.json({
        success: true,
        message: `Subscription ${subscribed ? 'confirmed' : 'declined'} successfully`,
        subscribed: subscribed,
        userData: {
          name: name,
          email: email,
          interest: interest
        },
        webhookResult: webhookResult
      });
    } else {
      console.error("❌ n8n subscription webhook failed:", n8nResponse.status);
      res.status(500).json({
        success: false,
        error: 'Failed to process subscription'
      });
    }

  } catch (error) {
    console.error("❌ Subscription webhook failed:", error);
    res.status(500).json({
      success: false,
      error: 'Network error occurred'
    });
  }
});


// Get articles by specific IDs
app.get('/api/articles/by-ids', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        success: false,
        error: 'IDs parameter required'
      });
    }
    
    const requestedIds = ids.split(',');
    const files = await fs.readdir(ARTICLES_DIR);
    const matchedArticles = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(ARTICLES_DIR, file);
          const content = await fs.readFile(filePath, 'utf8');
          const article = JSON.parse(content);
          
          if (requestedIds.includes(article.id)) {
            article.filename = file;
            matchedArticles.push(article);
          }
        } catch (err) {
          console.error(`Error reading article ${file}:`, err.message);
        }
      }
    }
    
    res.json({
      success: true,
      count: matchedArticles.length,
      articles: matchedArticles
    });
  } catch (err) {
    console.error('Error fetching articles by IDs:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch articles'
    });
  }
});

//delete all articles
app.delete('/api/articles/all', async (req, res) => {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(ARTICLES_DIR, file));
        deletedCount++;
      }
    }
    
    console.log(`Deleted ${deletedCount} articles`);
    
    res.json({
      success: true,
      message: `Deleted ${deletedCount} articles`,
      count: deletedCount
    });
  } catch (error) {
    console.error('Error deleting articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete articles'
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
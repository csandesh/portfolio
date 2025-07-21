const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, images, etc.)
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create blog posts table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT DEFAULT 'Sandesh Chhetri',
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Routes

// Get all blog posts
app.get('/api/posts', (req, res) => {
    db.all('SELECT * FROM blog_posts ORDER BY created_date DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// Get a single blog post by ID
app.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM blog_posts WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ post: row });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    });
});

// Create a new blog post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const stmt = db.prepare('INSERT INTO blog_posts (title, content, author) VALUES (?, ?, ?)');
    stmt.run([title, content, author || 'Sandesh Chhetri'], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            message: 'Blog post created successfully'
        });
    });
    stmt.finalize();
});

// Update a blog post
app.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const { title, content, author } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const stmt = db.prepare('UPDATE blog_posts SET title = ?, content = ?, author = ?, updated_date = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run([title, content, author || 'Sandesh Chhetri', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json({ message: 'Blog post updated successfully' });
        }
    });
    stmt.finalize();
});

// Delete a blog post
app.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM blog_posts WHERE id = ?');
    stmt.run([id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json({ message: 'Blog post deleted successfully' });
        }
    });
    stmt.finalize();
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully close database connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
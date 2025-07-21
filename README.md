# Portfolio Website with Blog

This is Sandesh Chhetri's portfolio website with integrated blog functionality.

## Features

- Static portfolio pages (Home, Resume, Portfolio)
- Dynamic blog system with database storage
- Admin interface for creating, editing, and deleting blog posts
- RESTful API for blog operations

## Setup and Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For development with auto-restart:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - Main site: `http://localhost:3000`
   - Blog: `http://localhost:3000/blog.html`
   - Admin: `http://localhost:3000/admin`

## Blog Management

- Access the admin interface at `/admin` to create new blog posts
- Blog posts are stored in a SQLite database (`blog.db`)
- The blog page dynamically loads and displays all published posts

## API Endpoints

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get a specific blog post
- `POST /api/posts` - Create a new blog post
- `PUT /api/posts/:id` - Update a blog post
- `DELETE /api/posts/:id` - Delete a blog post

## Technologies Used

- Backend: Node.js, Express.js
- Database: SQLite3
- Frontend: HTML, CSS, JavaScript
- Static files serving for portfolio content
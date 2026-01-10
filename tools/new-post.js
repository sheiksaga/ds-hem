#!/usr/bin/env node

/**
 * New Post Generator CLI Tool
 * Creates a new blog post with YAML frontmatter and updates posts.json
 *
 * Usage: node tools/new-post.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_DIR = path.join(__dirname, '..', 'blog');
const POSTS_JSON = path.join(BLOG_DIR, 'posts.json');
const TEMPLATE_FILE = path.join(BLOG_DIR, 'template.md');

// Valid categories
const VALID_CATEGORIES = ['web_design', 'general'];

/**
 * Generate URL-safe slug from title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Prompt user for input
 */
function prompt(question) {
    return new Promise((resolve) => {
        process.stdout.write(question + ' ');
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

/**
 * Read posts.json
 */
function loadPostsJson() {
    if (!fs.existsSync(POSTS_JSON)) {
        console.error(`Error: ${POSTS_JSON} not found!`);
        console.error('Please create a posts.json file first.');
        process.exit(1);
    }

    try {
        const content = fs.readFileSync(POSTS_JSON, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.error('Error: Failed to parse posts.json');
        console.error(e.message);
        process.exit(1);
    }
}

/**
 * Save posts.json
 */
function savePostsJson(data) {
    try {
        fs.writeFileSync(
            POSTS_JSON,
            JSON.stringify(data, null, 2) + '\n',
            'utf8'
        );
    } catch (e) {
        console.error('Error: Failed to save posts.json');
        console.error(e.message);
        process.exit(1);
    }
}

/**
 * Create new markdown file
 */
function createMarkdownFile(frontmatter, filepath) {
    const content = `---
${frontmatter}
---

# ${frontmatter.title}

Write your content here...
`;

    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`✓ Created: ${filepath}`);
    } catch (e) {
        console.error(`Error: Failed to create ${filepath}`);
        console.error(e.message);
        process.exit(1);
    }
}

/**
 * Main function
 */
async function main() {
    console.log('\n=== New Blog Post Generator ===\n');

    // Get post title
    const title = await prompt('Post title:');
    if (!title) {
        console.error('Error: Title is required');
        process.exit(1);
    }

    // Get date (default to today)
    const today = new Date();
    const defaultDate = formatDate(today);
    const dateInput = await prompt(`Date (YYYY-MM-DD) [${defaultDate}]:`);
    const date = dateInput || defaultDate;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error('Error: Invalid date format. Use YYYY-MM-DD');
        process.exit(1);
    }

    // Get category
    const categoryPrompt = `Category (${VALID_CATEGORIES.join(', ')}):`;
    const category = await prompt(categoryPrompt);

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
        console.error(`Error: Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        process.exit(1);
    }

    // Generate slug and filename
    const slug = generateSlug(title);
    const year = date.split('-')[0];
    const filename = `${title}.md`;
    const filepath = path.join(BLOG_DIR, 'posts', year, filename);
    const relativePath = `./posts/${year}/${filename}`;

    // Create YAML frontmatter
    const frontmatter = `title: "${title}"
date: ${date}
category: ${category}`;

    // Create the markdown file
    createMarkdownFile(frontmatter, filepath);

    // Update posts.json
    const postsData = loadPostsJson();

    // Check if slug already exists
    const exists = postsData.posts.find(p => p.slug === slug && p.year === year);
    if (exists) {
        console.warn(`Warning: A post with slug "${slug}" already exists in ${year}`);
        const overwrite = await prompt('Overwrite existing entry? (yes/no):');
        if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
            console.log('Cancelled. Posts.json not updated.');
            process.exit(0);
        }
        // Remove existing entry
        postsData.posts = postsData.posts.filter(p => !(p.slug === slug && p.year === year));
    }

    // Add new post to posts.json
    const newPost = {
        slug: slug,
        title: title,
        date: date,
        category: category,
        file: relativePath,
        year: year
    };

    postsData.posts.push(newPost);

    // Sort posts by date (newest first)
    postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save posts.json
    savePostsJson(postsData);
    console.log(`✓ Updated: ${POSTS_JSON}`);

    // Done!
    console.log('\n✓ Post created successfully!\n');
    console.log(`Your post is ready! Edit the file at:`);
    console.log(`  ${filepath}\n`);
    console.log(`After writing your content, the post will be available at:`);
    console.log(`  #post/${year}/${slug}\n`);

    process.exit(0);
}

// Set stdin to raw mode for prompting
process.stdin.setEncoding('utf8');

// Run main function
main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});

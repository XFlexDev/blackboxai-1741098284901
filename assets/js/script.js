// DOM Elements
const blogPostsContainer = document.getElementById('blogPosts');
const featuredPostContainer = document.getElementById('featuredPost');
const noPostsMessage = document.getElementById('noPostsMessage');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchContent = document.getElementById('searchContent');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');

// Blog post template
const createBlogPostCard = (post, isFeatured = false) => {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (isFeatured) {
        return `
            <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                <div class="flex flex-col lg:flex-row">
                    ${post.imageUrl ? `
                        <div class="lg:w-1/2">
                            <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-64 lg:h-full object-cover image-hover">
                        </div>
                    ` : ''}
                    <div class="p-8 lg:w-1/2">
                        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4 gradient-text">${post.title}</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">${post.content.substring(0, 200)}...</p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                <i class="far fa-calendar-alt mr-2"></i>${date}
                            </span>
                            <button onclick="showFullPost(${post.id})" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    return `
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden blog-card">
            ${post.imageUrl ? `
                <div class="relative h-48 overflow-hidden">
                    <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110">
                </div>
            ` : ''}
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${post.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${post.content.substring(0, 100)}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        <i class="far fa-calendar-alt mr-2"></i>${date}
                    </span>
                    <button onclick="showFullPost(${post.id})" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300">
                        Read More <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
};

// Load and render blog posts
const loadBlogPosts = () => {
    try {
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        
        if (posts.length === 0) {
            // Add sample post if no posts exist
            const samplePost = {
                id: 1,
                title: "Welcome to Modern Blog",
                content: "This is a sample blog post to demonstrate the features of our modern blog platform. The platform supports dark mode, beautiful animations, and a clean, responsive design. Start adding your own posts through the admin dashboard!",
                date: new Date().toISOString(),
                imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
            };
            posts = [samplePost];
            localStorage.setItem('blogPosts', JSON.stringify(posts));
        }

        // Show/hide no posts message
        noPostsMessage.style.display = posts.length === 0 ? 'block' : 'none';

        // Render featured post (most recent)
        if (posts.length > 0) {
            const featuredPost = posts[0];
            featuredPostContainer.innerHTML = createBlogPostCard(featuredPost, true);
            featuredPostContainer.classList.remove('opacity-0', 'translate-y-4');
        }

        // Render other posts
        const otherPosts = posts.slice(1);
        blogPostsContainer.innerHTML = otherPosts
            .map(post => createBlogPostCard(post))
            .join('');

    } catch (error) {
        console.error('Error loading blog posts:', error);
        noPostsMessage.style.display = 'block';
    }
};

// Navigate to full post page
const showFullPost = (postId) => {
    window.location.href = `post.html?id=${postId}`;
};

// Search functionality
const setupSearch = () => {
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });

    closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );

        blogPostsContainer.innerHTML = filteredPosts
            .map(post => createBlogPostCard(post))
            .join('');
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    setupSearch();
});

// Handle dark mode preference changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        document.documentElement.classList.toggle('dark', e.matches);
    });
}

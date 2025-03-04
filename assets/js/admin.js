

// DOM Elements
const blogForm = document.getElementById('blogForm');
const successMessage = document.getElementById('successMessage');

// Handle form submission
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageUrl = document.getElementById('imageUrl').value;

    try {
        // Get existing posts
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

        // Create new post
        const newPost = {
            id: Date.now(), // Use timestamp as ID
            title,
            content,
            imageUrl: imageUrl || '',
            date: new Date().toISOString()
        };

        // Add new post to beginning of array
        posts.unshift(newPost);

        // Save to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        // Show success message
        showSuccessMessage();

        // Reset form
        blogForm.reset();

        // Add animation to form
        blogForm.classList.add('scale-95', 'opacity-75');
        setTimeout(() => {
            blogForm.classList.remove('scale-95', 'opacity-75');
        }, 300);

    } catch (error) {
        console.error('Error saving blog post:', error);
        showErrorMessage('Failed to save blog post. Please try again.');
    }
});

// Show success message
const showSuccessMessage = () => {
    successMessage.classList.remove('hidden');
    successMessage.classList.add('scale-100', 'opacity-100');

    // Hide message after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('scale-100', 'opacity-100');
        successMessage.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 300);
    }, 3000);
};

// Show error message
const showErrorMessage = (message) => {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 toast-notification';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle mr-2"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(errorMessage);

    setTimeout(() => {
        errorMessage.classList.add('opacity-0', 'translate-x-4');
        setTimeout(() => {
            errorMessage.remove();
        }, 300);
    }, 3000);
};

// Form validation
const validateForm = () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const imageUrl = document.getElementById('imageUrl');

    // Title validation
    title.addEventListener('input', (e) => {
        if (e.target.value.length < 3) {
            title.classList.add('border-red-500');
        } else {
            title.classList.remove('border-red-500');
        }
    });

    // Content validation
    content.addEventListener('input', (e) => {
        if (e.target.value.length < 10) {
            content.classList.add('border-red-500');
        } else {
            content.classList.remove('border-red-500');
        }
    });

    // Image URL validation
    imageUrl.addEventListener('input', (e) => {
        if (e.target.value && !isValidUrl(e.target.value)) {
            imageUrl.classList.add('border-red-500');
        } else {
            imageUrl.classList.remove('border-red-500');
        }
    });
};

// URL validation helper
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Auto-save draft functionality
let autoSaveTimeout;
const setupAutoSave = () => {
    const inputs = ['title', 'content', 'imageUrl'];
    
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        element.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const formData = {
                    title: document.getElementById('title').value,
                    content: document.getElementById('content').value,
                    imageUrl: document.getElementById('imageUrl').value
                };
                localStorage.setItem('blogDraft', JSON.stringify(formData));
            }, 1000);
        });
    });

    // Load draft on page load
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        document.getElementById('title').value = formData.title || '';
        document.getElementById('content').value = formData.content || '';
        document.getElementById('imageUrl').value = formData.imageUrl || '';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    validateForm();
    setupAutoSave();
});

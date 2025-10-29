document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZACIÓN ---
    const scriptTag = document.querySelector('script[data-category]');
    const categoryToFilter = scriptTag ? scriptTag.getAttribute('data-category') : 'all';

    loadPosts(categoryToFilter);

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Carga las publicaciones desde la variable global `postsData` y las muestra.
     * @param {string} category - La categoría a filtrar. 'all' para mostrar todas.
     */
    function loadPosts(category) {
        const container = document.getElementById('posts-container');
        if (!container) {
            console.error('Error: No se encontró el contenedor de publicaciones #posts-container.');
            return;
        }

        // Verifica que la variable `postsData` del archivo data.js exista.
        if (typeof postsData === 'undefined') {
            console.error('Error: No se encontraron los datos de las publicaciones. Asegúrate de que data.js se cargue correctamente.');
            container.innerHTML = '<p>Error al cargar los datos de las publicaciones.</p>';
            return;
        }

        const filteredPosts = (category === 'all') ? postsData : postsData.filter(post => post.category === category);

        if (filteredPosts.length === 0) {
            container.innerHTML = `<p>No hay publicaciones en esta categoría.</p>`;
            return;
        }

        filteredPosts.forEach(postData => {
            const postElement = createPostElement(postData);
            container.appendChild(postElement);
        });

        initializePage();
    }

    function createPostElement(postData) {
        const post = document.createElement('div');
        post.className = 'post';
        post.dataset.category = postData.category;

        post.innerHTML = `
            <div class="post-header"><div class="post-avatar">${postData.avatar}</div><div class="post-info"><div class="post-author">${postData.author}</div><div class="post-date"></div></div></div>
            <div class="post-image">${postData.imageText}</div>
            <div class="post-actions"><button class="like-btn">🤍</button><span class="likes-count">${postData.likes} Me gusta</span></div>
            <div class="post-description"><span class="author">${postData.author}</span> ${postData.description}</div>
        `;
        return post;
    }

    function initializePage() {
        updateAllPostDates();
        setupLikeButtons();
    }

    function setupLikeButtons() {
        const container = document.querySelector('.posts-container');
        if (!container) return;
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('like-btn')) {
                const likeBtn = event.target;
                const likesCountSpan = likeBtn.nextElementSibling;
                let likesCount = parseInt(likesCountSpan.textContent) || 0;
                if (likeBtn.classList.toggle('liked')) {
                    likeBtn.textContent = '❤️';
                    likesCount++;
                } else {
                    likeBtn.textContent = '🤍';
                    likesCount = Math.max(0, likesCount - 1);
                }
                likesCountSpan.textContent = `${likesCount} Me gusta`;
            }
        });
    }

    function updateAllPostDates() {
        document.querySelectorAll('.post-date').forEach(dateElement => {
            const randomHoursAgo = Math.floor(Math.random() * 72) + 1;
            const postDate = new Date(new Date().getTime() - randomHoursAgo * 3600 * 1000);
            dateElement.textContent = getRelativeTime(postDate);
        });
    }

    function getRelativeTime(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `Hace ${days} d`;
        if (hours > 0) return `Hace ${hours} h`;
        if (minutes > 0) return `Hace ${minutes} min`;
        return `Hace unos segundos`;
    }
});
document.addEventListener('DOMContentLoaded', () => {

    // --- MANEJO DEL MENÚ HAMBURGUESA ---
    const hamburgerButton = document.querySelector('.hamburger-button');
    const sidebarMenu = document.querySelector('.sidebar-menu');

    if (hamburgerButton && sidebarMenu) {
        hamburgerButton.addEventListener('click', () => {
            sidebarMenu.classList.toggle('is-active');
        });
    }

    // --- INICIALIZACIÓN ---
    const scriptTag = document.querySelector('script[data-category]');
    const categoryToFilter = scriptTag ? scriptTag.getAttribute('data-category') : 'all';

    loadPosts(categoryToFilter);

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Carga las publicaciones desde la API y las muestra.
     * @param {string} category - La categoría a filtrar. 'all' para mostrar todas.
     */
    async function loadPosts(category) {
        const container = document.getElementById('posts-container');
        if (!container) {
            console.error('Error: No se encontró el contenedor de publicaciones #posts-container.');
            return;
        }

        try {
            const response = await fetch('api/get_posts.php');
            if (!response.ok) {
                throw new Error('Error al cargar las publicaciones');
            }
            const postsData = await response.json();

            let filteredPosts;
            if (category === 'all') {
                filteredPosts = postsData;
            } else if (category === 'arte-y-cultura') {
                filteredPosts = postsData.filter(post => ['cultural-artistico', 'grafica-ilustracion', 'actividades'].includes(post.category));
            } else {
                filteredPosts = postsData.filter(post => post.category === category);
            }

            if (filteredPosts.length === 0) {
                container.innerHTML = `<p>No hay publicaciones en esta categoría.</p>`;
                return;
            }

            container.innerHTML = ''; // Limpiar contenedor
            filteredPosts.forEach(postData => {
                const postElement = createPostElement(postData);
                container.appendChild(postElement);
            });

            initializePage();

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<p>Error al cargar los datos de las publicaciones.</p>';
        }
    }

    function createPostElement(postData) {
        const post = document.createElement('div');
        post.className = 'post';
        post.dataset.category = postData.category;
        post.dataset.id = postData.id; // Guardar ID del post

        // Determina si imageText es una URL de imagen o texto plano
        let imageContent;
        // Una simple comprobación para ver si la cadena parece una URL
        if (postData.image_text && (postData.image_text.startsWith('http') || postData.image_text.startsWith('https'))) {
            // Si es una URL, crea una etiqueta de imagen
            imageContent = `<img src="${postData.image_text}" alt="${postData.description.substring(0, 50)}...">`;
        } else {
            // Si no, úsalo como texto plano (comportamiento anterior)
            imageContent = postData.image_text;
        }

        post.innerHTML = `
            <div class="post-header"><div class="post-avatar">${postData.avatar}</div><div class="post-info"><div class="post-author">${postData.author}</div><div class="post-date"></div></div></div>
            <div class="post-image">${imageContent}</div>
            <div class="post-actions"><button class="like-btn" data-id="${postData.id}">🤍</button><span class="likes-count">${postData.likes} Me gusta</span></div>
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
        container.addEventListener('click', async (event) => {
            if (event.target.classList.contains('like-btn')) {
                const likeBtn = event.target;
                const postId = likeBtn.dataset.id;
                const likesCountSpan = likeBtn.nextElementSibling;

                try {
                    const response = await fetch('api/like_post.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: postId })
                    });

                    if (!response.ok) {
                        throw new Error('Error al dar like');
                    }

                    const result = await response.json();
                    if (result.success) {
                        likeBtn.textContent = '❤️';
                        likeBtn.classList.add('liked');
                        likesCountSpan.textContent = `${result.likes} Me gusta`;
                    } else {
                        console.error('Error del servidor:', result.error);
                    }

                } catch (error) {
                    console.error('Error al procesar el like:', error);
                }
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
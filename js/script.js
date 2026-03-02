document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Case Study Modal & Dynamic Rendering Logic ---
    const caseModal = document.getElementById('case-modal');
    const casesGrid = document.getElementById('cases-grid');

    if (caseModal && casesGrid) {
        const closeBtn = document.querySelector('.close-btn');
        const modalIframe = document.getElementById('modal-iframe');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalCapacity = document.getElementById('modal-capacity');
        const modalDesc = document.getElementById('modal-desc');

        function closeModal() {
            caseModal.classList.remove('show');
            setTimeout(() => {
                caseModal.style.display = 'none';
                modalIframe.src = '';
                document.body.style.overflow = '';
            }, 300);
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target == caseModal) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && caseModal.classList.contains('show')) closeModal();
        });

        // Fetch Cases Data
        fetch('data/cases.json')
            .then(response => response.json())
            .then(data => {
                const casesData = data.items || [];
                casesGrid.innerHTML = ''; // clear loading state if any

                casesData.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'case-card';
                    card.setAttribute('data-title', item.title || '');
                    card.setAttribute('data-date', item.date || '');
                    card.setAttribute('data-capacity', item.capacity || '');
                    card.setAttribute('data-desc', item.desc || '');
                    card.setAttribute('data-video', item.video || '');
                    card.setAttribute('data-image', item.image || '');

                    const isSchematic = item.is_schematic ? 'schematic' : '';

                    card.innerHTML = `
                        <div class="case-thumb">
                            <div class="schematic-wrapper ${isSchematic}">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="case-overlay">
                                <span>查看詳情</span>
                            </div>
                        </div>
                        <div class="case-info">
                            <h3>${item.title}</h3>
                            <p class="case-brief">${item.brief}</p>
                            <button class="btn-text text-small">了解更多 &rarr;</button>
                        </div>
                    `;
                    casesGrid.appendChild(card);

                    // Attach click listener
                    card.addEventListener('click', () => {
                        modalTitle.textContent = item.title;
                        modalDate.textContent = item.date;
                        modalCapacity.textContent = item.capacity;
                        modalDesc.textContent = item.desc;

                        const modalImg = document.getElementById('modal-image');
                        const modalVideoContainer = document.getElementById('modal-video-container');

                        // 處理圖片顯示邏輯
                        if (item.image) {
                            modalImg.src = item.image;
                            modalImg.style.display = 'block';
                        } else {
                            modalImg.src = '';
                            modalImg.style.display = 'none';
                        }

                        // 處理影片顯示邏輯
                        if (item.video) {
                            modalIframe.src = `https://www.youtube.com/embed/${item.video}?autoplay=1`;
                            modalVideoContainer.style.display = 'block';

                            // 為了美觀，如果有影片也有圖片，讓圖片加上一點下邊距
                            modalImg.style.marginBottom = item.image ? '15px' : '0';
                        } else {
                            modalIframe.src = '';
                            modalVideoContainer.style.display = 'none';
                            modalImg.style.marginBottom = '0';
                        }

                        caseModal.style.display = 'block';
                        setTimeout(() => {
                            caseModal.classList.add('show');
                        }, 10);
                        document.body.style.overflow = 'hidden';
                    });
                });
            })
            .catch(error => console.error('Error fetching cases:', error));
    }

    // --- Contact Section Logic ---
    const showFormBtn = document.getElementById('show-form-btn');
    const contactFormContainer = document.getElementById('contact-form-container');

    if (showFormBtn && contactFormContainer) {
        showFormBtn.addEventListener('click', () => {
            contactFormContainer.classList.add('show');
            const yOffset = -50;
            const y = contactFormContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            showFormBtn.style.display = 'none';
        });
    }

    // --- Global News Data & Rendering ---
    let newsContent = [];
    const newsGrid = document.querySelector('.news-grid');
    const newsDetailContainer = document.getElementById('news-detail-container');

    // Check if we are on index (newsGrid exists) or detail page (newsDetailContainer exists)
    if (newsGrid || newsDetailContainer) {
        fetch('data/news.json')
            .then(response => response.json())
            .then(data => {
                newsContent = data.items || [];

                // Initialize Homepage Rendering
                if (newsGrid) {
                    const itemsPerPage = 3;
                    let currentPage = 1;

                    function renderPagination() {
                        const existingPagination = document.querySelector('.pagination-container');
                        if (existingPagination) existingPagination.remove();

                        const totalPages = Math.ceil(newsContent.length / itemsPerPage);
                        if (totalPages <= 1) return;

                        const paginationContainer = document.createElement('div');
                        paginationContainer.className = 'pagination-container';
                        paginationContainer.style.textAlign = 'center';
                        paginationContainer.style.marginTop = '30px';
                        paginationContainer.style.display = 'flex';
                        paginationContainer.style.justifyContent = 'center';
                        paginationContainer.style.gap = '10px';

                        for (let i = 1; i <= totalPages; i++) {
                            const btn = document.createElement('button');
                            btn.textContent = i;
                            btn.className = `btn-secondary ${i === currentPage ? 'active' : ''}`;
                            btn.style.padding = '5px 15px';
                            btn.style.cursor = 'pointer';
                            if (i !== currentPage) {
                                btn.style.opacity = '0.6';
                            }

                            btn.onclick = () => {
                                currentPage = i;
                                renderNews(currentPage);
                            };
                            paginationContainer.appendChild(btn);
                        }
                        newsGrid.parentNode.appendChild(paginationContainer);
                    }

                    function renderNews(page) {
                        newsGrid.innerHTML = '';
                        const start = (page - 1) * itemsPerPage;
                        const end = start + itemsPerPage;
                        const paginatedItems = newsContent.slice(start, end);

                        paginatedItems.forEach((item, index) => {
                            const originalIndex = start + index;
                            const card = document.createElement('div');
                            card.className = 'news-card';
                            card.onclick = () => location.href = `news-detail.html?id=${originalIndex}`;
                            card.style.cursor = 'pointer';

                            const sourceHTML = item.source ? `<span class="image-source">圖片來源：${item.source}</span>` : '';
                            const isSchematic = item.is_schematic ? 'schematic' : '';

                            card.innerHTML = `
                                <div class="news-header">
                                    <span class="news-date">${item.date || ''}</span>
                                    <span class="news-tag">${item.tag || ''}</span>
                                </div>
                                <div class="news-body">
                                    <h3 class="news-title">${item.title}</h3>
                                    <p class="news-desc">${item.text}</p>
                                </div>
                                <div class="news-image">
                                    <div class="schematic-wrapper ${isSchematic}">
                                        <img src="${item.img}" alt="${item.title}">
                                    </div>
                                    ${sourceHTML}
                                </div>
                            `;
                            newsGrid.appendChild(card);
                        });
                        renderPagination();
                    }

                    // Initial Render
                    renderNews(currentPage);
                }

                if (newsDetailContainer) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const newsId = urlParams.get('id');

                    if (newsId !== null && newsContent[newsId]) {
                        const data = newsContent[newsId];
                        const sourceHTML = data.source ? `<span class="image-source">圖片來源：${data.source}</span>` : '';
                        const isSchematic = data.is_schematic ? 'schematic' : '';

                        newsDetailContainer.innerHTML = `
                            <div class="news-detail-header">
                                <span class="news-detail-date">${data.date || ''}</span>
                                <h1 class="news-detail-title">${data.title}</h1>
                            </div>
                            <div class="news-detail-image">
                                <div class="schematic-wrapper ${isSchematic}">
                                    <img src="${data.img}" alt="${data.title}">
                                </div>
                                ${sourceHTML}
                            </div>
                            <div class="news-detail-body">
                                ${data.text.replace(/\n/g, '<br>')}
                            </div>
                        `;
                    } else {
                        newsDetailContainer.innerHTML = '<p class="error-msg">找不到該則新聞。</p>';
                    }
                }
            })
            .catch(error => console.error('Error fetching news:', error));
    }
});

// --- Sidebar Interaction Disable (Step 309) ---
document.querySelectorAll('.floating-sidebar .sidebar-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent link navigation
        console.log('Sidebar item clicked but disabled.');
    });
});

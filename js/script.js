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
                // 不反轉陣列，與 CMS 編輯後台管理順序保持一致
                let casesData = data.items || [];

                // --- 分頁變數設定 ---
                const itemsPerPage = 3;
                let currentPage = 1;

                function renderPagination() {
                    const existingPagination = document.getElementById('cases-pagination-container');
                    if (existingPagination) existingPagination.remove();

                    const totalPages = Math.ceil(casesData.length / itemsPerPage);
                    if (totalPages <= 1) return;

                    const paginationContainer = document.createElement('div');
                    paginationContainer.id = 'cases-pagination-container';
                    paginationContainer.style.textAlign = 'center';
                    paginationContainer.style.marginTop = '40px';
                    paginationContainer.style.display = 'flex';
                    paginationContainer.style.justifyContent = 'center';
                    paginationContainer.style.gap = '10px';

                    for (let i = 1; i <= totalPages; i++) {
                        const btn = document.createElement('button');
                        btn.textContent = i;
                        btn.className = `btn-secondary ${i === currentPage ? 'active' : ''}`;
                        btn.style.padding = '5px 15px';
                        btn.style.cursor = 'pointer';

                        // 非當前頁加上半透明與 Hover 效果
                        if (i !== currentPage) {
                            btn.style.opacity = '0.6';
                        }

                        btn.onclick = () => {
                            currentPage = i;
                            renderCases(currentPage);
                        };
                        paginationContainer.appendChild(btn);
                    }
                    casesGrid.parentNode.appendChild(paginationContainer);
                }

                function renderCases(page) {
                    casesGrid.innerHTML = '';
                    renderPagination();

                    // 計算當前頁要顯示的陣列切片
                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageItems = casesData.slice(start, end);

                    pageItems.forEach(item => {
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
                            document.getElementById('modal-title').textContent = item.title || '';

                            const subtitleEl = document.getElementById('modal-subtitle');
                            if (item.brief) {
                                subtitleEl.textContent = item.brief;
                                subtitleEl.style.display = 'block';
                            } else {
                                subtitleEl.style.display = 'none';
                            }

                            document.getElementById('modal-date').textContent = item.date || '-';
                            document.getElementById('modal-capacity').textContent = item.capacity || '-';

                            // 擷取減碳量(若有提及)
                            const descText = item.desc || '';
                            const co2Match = descText.match(/減[\u4e00-\u9fa5]*?([約\d,]+)\s*噸碳/i);
                            const co2Card = document.getElementById('modal-co2-card');
                            if (co2Match) {
                                document.getElementById('modal-co2').textContent = `${co2Match[1]} 噸`;
                                co2Card.style.display = 'flex';
                            } else {
                                co2Card.style.display = 'none';
                            }

                            // 處理文字換行
                            document.getElementById('modal-desc').innerHTML = descText.replace(/\n/g, '<br>');

                            const modalImg = document.getElementById('modal-image');
                            const modalMediaContainer = document.getElementById('modal-media-container');
                            const modalVideoContainer = document.getElementById('modal-video-container');

                            // 處理圖片顯示邏輯
                            if (item.image) {
                                modalImg.src = item.image;
                                modalImg.style.display = 'block';
                                modalMediaContainer.style.display = 'flex';
                            } else {
                                modalImg.src = '';
                                modalImg.style.display = 'none';
                                modalMediaContainer.style.display = 'none';
                            }

                            // 處理影片顯示邏輯
                            if (item.video) {
                                document.getElementById('modal-iframe').src = `https://www.youtube.com/embed/${item.video}`;
                                modalVideoContainer.style.display = 'block';
                            } else {
                                document.getElementById('modal-iframe').src = '';
                                modalVideoContainer.style.display = 'none';
                            }

                            caseModal.style.display = 'block';
                            setTimeout(() => {
                                caseModal.classList.add('show');
                            }, 10);
                            document.body.style.overflow = 'hidden';
                        });
                    });
                }

                // Initial render ( cases 預設顯示第一頁，不反向 )
                renderCases(currentPage);
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

// --- Scroll Reveal Animation ---
document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15, // 元素進入視窗 15% 時觸發
        rootMargin: "0px 0px -50px 0px" // 提早或延遲觸發的邊界
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // 停止觀察已顯示的元素，讓動畫只播放一次
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});

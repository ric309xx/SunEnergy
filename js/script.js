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

    // --- Case Study Modal Logic ---
    const caseModal = document.getElementById('case-modal');
    if (caseModal) {
        const closeBtn = document.querySelector('.close-btn');
        const modalIframe = document.getElementById('modal-iframe');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalCapacity = document.getElementById('modal-capacity');
        const modalDesc = document.getElementById('modal-desc');

        const caseCards = document.querySelectorAll('.case-card');

        caseCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.getAttribute('data-title');
                const date = card.getAttribute('data-date');
                const capacity = card.getAttribute('data-capacity');
                const desc = card.getAttribute('data-desc');
                const videoId = card.getAttribute('data-video');

                modalTitle.textContent = title;
                modalDate.textContent = date;
                modalCapacity.textContent = capacity;
                modalDesc.textContent = desc;
                modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

                caseModal.style.display = 'block';
                setTimeout(() => {
                    caseModal.classList.add('show');
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });

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

    // --- Global News Data ---
    const newsContent = [
        {
            date: '2024-04-11',
            tag: '生態保育',
            title: '友善動物的綠能棲地',
            img: 'images/news-real-animals.jpg',
            source: 'Sergei Gapon',
            text: `Sun Energy 的案場設計保留了原本的植被與生態廊道，寬闊的模組間距讓羊群能自由穿梭覓食。
            
            太陽能板下的陰影更成為了小動物們躲避艷陽與猛禽的天然庇護所。我們證明了，能源開發不一定要犧牲棲地，反而能為在這片土地上生長的動物們，打造一個更安全、舒適的家園。
            
            透過與生態專家的合作，我們持續監測案場內的生物多樣性，確保綠能發展與生態保育能夠並行不悖。這不僅是為了環境，更是為了留給下一代一個生生不息的地球。`
        },
        {
            date: '2024-03-25',
            tag: '農電共生',
            title: '農電共生的豐收田野',
            img: 'images/news-real-plants.jpg',
            source: 'Pexels',
            text: `透過精密的日照模擬分析，我們在農田上方設置了透光率最佳化的太陽能板。
            
            這不僅為農作物提供了適度的遮蔭，減少了水分蒸發與極端氣候的損害，更讓農民在耕作之餘能享有穩定的綠電收益。從耐陰蔬菜到高經濟價值的香草植物，我們見證了土地的雙重豐收。
            
            實際案例顯示，在適當的遮蔭下，某些作物的品質甚至優於全日照環境。農電共生實現了糧食安全與能源轉型的完美平衡，讓農業與綠能成為彼此最好的夥伴。`
        },
        {
            date: '2024-02-18',
            tag: '環境永續',
            title: '與自然共呼吸的永續循環',
            img: 'images/news-real-environment.jpg',
            source: 'Unsplash',
            text: `我們深信，最好的工程是融入地景的工程。在規劃階段，我們優先考量地形地貌的完整性，避免大規模的整地與砍伐。
            
            案場周邊種植了原生樹種作為綠籬，不僅美化了視覺景觀，更涵養了水源與土壤。Sun Energy 致力於打造一座座會呼吸的發電廠，讓每一度綠電，都源自於對大自然的謙卑與尊重。
            
            我們堅持使用可回收的材料，並制定了完整的退役回收計畫，確保太陽能板在生命週期結束後，不會成為環境的負擔，真正落實循環經濟的理念。`
        },
        {
            date: '2024-01-10',
            tag: '社區創生',
            title: '社區能源共享計畫啟動',
            img: 'images/news-real-4.jpg',
            source: 'Pexels',
            text: `Sun Energy 正式啟動社區能源共享計畫，讓無法建置太陽能板的住戶，也能透過認購模式參與綠能發電。
            
            這項計畫不僅讓居民能享有穩定的售電回饋，部分收益更將回饋給社區，用於改善公共設施與照護獨居長者。我們希望綠能不只是硬體的建設，更能成為連結社區情感、創造共好的紐帶。
            
            首波示範社區已在台南展開，獲得居民熱烈迴響。未來我們將持續推廣此模式，讓潔淨能源走入更多家庭。`
        },
        {
            date: '2023-12-05',
            tag: '能源教育',
            title: '光電教育向下扎根',
            img: 'images/news-real-5.jpg',
            source: 'Unsplash',
            text: `為了讓下一代更了解再生能源的重要性，Sun Energy 舉辦了一系列「小小光電工程師」體驗營。
            
            透過寓教於樂的實作課程，孩子們親手組裝太陽能模型車，並實地參觀案場，了解太陽能發電的原理與對環境的益處。看著孩子們專注發光的眼神，我們相信，綠色的種子已在他們心中萌芽。
            
            能源教育是百年大計，我們將持續投入資源，培育更多未來的綠能人才。`
        }
    ];

    // --- News Homepage Rendering & Pagination ---
    const newsGrid = document.querySelector('.news-grid');
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

                card.innerHTML = `
                    <div class="news-header">
                        <span class="news-date">${item.date}</span>
                        <span class="news-tag">${item.tag}</span>
                    </div>
                    <div class="news-body">
                        <h3 class="news-title">${item.title}</h3>
                        <p class="news-desc">${item.text}</p>
                    </div>
                    <div class="news-image">
                        <div class="schematic-wrapper">
                            <img src="${item.img}" alt="${item.title}">
                        </div>
                        <span class="image-source">圖片來源：${item.source}</span>
                    </div>
                `;
                newsGrid.appendChild(card);
            });
            renderPagination();
        }

        // Initial Render
        renderNews(currentPage);
    }

    // --- News Detail Page Logic ---
    const newsDetailContainer = document.getElementById('news-detail-container');
    if (newsDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');

        if (newsId !== null && newsContent[newsId]) {
            const data = newsContent[newsId];
            newsDetailContainer.innerHTML = `
                <div class="news-detail-header">
                    <span class="news-detail-date">${data.date}</span>
                    <h1 class="news-detail-title">${data.title}</h1>
                </div>
                <div class="news-detail-image">
                    <div class="schematic-wrapper">
                        <img src="${data.img}" alt="${data.title}">
                    </div>
                    <span class="image-source">圖片來源：${data.source}</span>
                </div>
                <div class="news-detail-body">
                    ${data.text.replace(/\n/g, '<br>')}
                </div>
            `;
        } else {
            newsDetailContainer.innerHTML = '<p class="error-msg">找不到該則新聞。</p>';
        }
    }
});

// --- Sidebar Interaction Disable (Step 309) ---
document.querySelectorAll('.floating-sidebar .sidebar-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent link navigation
        console.log('Sidebar item clicked but disabled.');
    });
});

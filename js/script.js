document.addEventListener('DOMContentLoaded', function () {

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

    if (reveals.length > 0) {
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // trigger once on load
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('mobile-link')) return; // handled in inline script in index.html
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

    // --- Globals for Modal ---
    const caseModal = document.getElementById('caseModal');
    const modalContent = document.getElementById('modalContent');
    const newsModal = document.getElementById('newsModal');
    const newsModalContent = document.getElementById('newsModalContent');

    window.closeModal = function () {
        if (!caseModal) return;
        caseModal.classList.add('opacity-0');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
        }

        document.body.style.overflow = '';

        // Stop video
        const iframe = document.getElementById('modalIframe');
        if (iframe) iframe.src = '';

        setTimeout(() => {
            caseModal.classList.add('hidden');
            caseModal.classList.remove('flex');
        }, 300);
    };

    window.closeNewsModal = function () {
        if (!newsModal) return;
        newsModal.classList.add('opacity-0');
        if (newsModalContent) {
            newsModalContent.classList.remove('scale-100');
            newsModalContent.classList.add('scale-95');
        }

        document.body.style.overflow = '';

        setTimeout(() => {
            newsModal.classList.add('hidden');
            newsModal.classList.remove('flex');
        }, 300);
    };

    if (caseModal || newsModal) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (caseModal && !caseModal.classList.contains('hidden')) closeModal();
                if (newsModal && !newsModal.classList.contains('hidden')) closeNewsModal();
            }
        });
    }

    // --- Dynamic Rendering Logic for Cases ---
    const casesGrid = document.getElementById('cases-grid');

    if (casesGrid) {
        fetch('data/cases.json')
            .then(response => response.json())
            .then(data => {
                let casesData = data.items ? [...data.items] : []; // 直接使用原始順序

                const itemsPerPage = 3;
                let currentPage = 1;

                function renderCasesPagination() {
                    let existingPagination = document.getElementById('cases-pagination-wrapper');
                    if (existingPagination) existingPagination.remove();

                    const totalPages = Math.ceil(casesData.length / itemsPerPage);
                    if (totalPages <= 1) return;

                    const paginationContainer = document.createElement('div');
                    paginationContainer.id = 'cases-pagination-wrapper';
                    paginationContainer.className = 'col-span-full flex flex-wrap justify-center mt-12 gap-3 pb-8';

                    for (let i = 1; i <= totalPages; i++) {
                        const btn = document.createElement('button');
                        btn.textContent = i;
                        if (i === currentPage) {
                            btn.className = 'w-10 h-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center transition shadow-[0_0_10px_rgba(255,215,0,0.3)] shadow-yellow-400/50 scale-105';
                        } else {
                            btn.className = 'w-10 h-10 rounded-full border border-white/20 text-gray-400 font-bold flex items-center justify-center hover:bg-white/10 hover:text-white transition';
                        }

                        btn.onclick = () => {
                            currentPage = i;
                            renderCases(currentPage);
                            // Scroll to top of cases section with offset
                            const target = document.getElementById('cases');
                            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        };
                        paginationContainer.appendChild(btn);
                    }
                    casesGrid.appendChild(paginationContainer);
                }

                function renderCases(page) {
                    casesGrid.innerHTML = '';

                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageItems = casesData.slice(start, end);

                    pageItems.forEach((item, index) => {
                        const card = document.createElement('div');
                        card.className = 'reveal delay-100 group cursor-pointer active bg-black/40 border border-white/5 rounded-2xl p-4 md:p-5 hover:border-yellow-400/30 transition duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col h-full';

                        // Handle schematic
                        const schematicHtml = item.is_schematic ? `<div class="absolute top-3 left-3 bg-red-500/90 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded backdrop-blur z-10 uppercase">示意圖</div>` : '';

                        card.innerHTML = `
                            <div class="image-zoom-container aspect-[4/3] mb-5 relative rounded-xl overflow-hidden border border-white/5 bg-[#111]">
                                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-tl from-[#111] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                ${schematicHtml}
                                <!-- Hover Overlay -->
                                <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 backdrop-blur-[2px]">
                                    <span class="px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                        <iconify-icon icon="solar:maximize-square-minimalistic-bold" class="text-lg"></iconify-icon>
                                        查看詳情
                                    </span>
                                </div>
                            </div>
                            <div class="flex-grow flex flex-col">
                                <h3 class="text-lg md:text-xl font-bold group-hover:text-yellow-400 transition leading-tight mb-2">${item.title}</h3>
                                <p class="text-sm text-gray-500 line-clamp-2 flex-grow">${item.brief || ''}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-white/5">
                                <div>
                                    <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-1">建置容量</p>
                                    <p class="font-bold text-sm text-gray-300">${item.capacity || '-'}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-1">完工狀態</p>
                                    <p class="font-bold text-sm text-yellow-500">${item.date || '-'}</p>
                                </div>
                            </div>
                        `;

                        // Attach click listener for modal
                        card.addEventListener('click', () => {
                            document.getElementById('modalImg').src = item.image || '';
                            document.getElementById('modalDate').textContent = item.date || '-';
                            document.getElementById('modalTitle').textContent = item.title || '';

                            const sub = document.getElementById('modalSubtitle');
                            if (item.brief) {
                                sub.textContent = item.brief;
                                sub.classList.remove('hidden');
                            } else {
                                sub.classList.add('hidden');
                            }

                            document.getElementById('modalCapacity').textContent = item.capacity || '-';

                            // Generation calc
                            const genGroup = document.getElementById('modalGenerationGroup');
                            if (item.capacity) {
                                const capNumber = parseFloat(item.capacity.replace(/[^\d.]/g, ''));
                                if (!isNaN(capNumber)) {
                                    const expectedGen = Math.round(capNumber * 1100);
                                    document.getElementById('modalGeneration').textContent = `約 ${expectedGen.toLocaleString()} 度`;
                                    genGroup.classList.remove('hidden');
                                } else {
                                    genGroup.classList.add('hidden');
                                }
                            } else {
                                genGroup.classList.add('hidden');
                            }

                            // Desc
                            const descText = item.desc || '';
                            document.getElementById('modalDesc').innerHTML = descText.replace(/\n/g, '<br>');

                            // Gallery Logic
                            const modalGalleryThumbs = document.getElementById('modal-gallery-thumbs');
                            let allImages = [];
                            if (item.image) allImages.push(item.image);
                            if (item.gallery && Array.isArray(item.gallery)) {
                                allImages = allImages.concat(item.gallery);
                            }

                            if (allImages.length > 1) {
                                modalGalleryThumbs.innerHTML = '';
                                modalGalleryThumbs.classList.remove('hidden');
                                allImages.forEach((imgSrc, idx) => {
                                    const th = document.createElement('div');
                                    th.className = `w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${idx === 0 ? 'border-yellow-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`;
                                    th.innerHTML = `<img src="${imgSrc}" class="w-full h-full object-cover">`;
                                    th.onclick = () => {
                                        document.getElementById('modalImg').src = imgSrc;
                                        Array.from(modalGalleryThumbs.children).forEach(c => {
                                            c.classList.add('border-transparent', 'opacity-60');
                                            c.classList.remove('border-yellow-400', 'opacity-100');
                                        });
                                        th.classList.remove('border-transparent', 'opacity-60');
                                        th.classList.add('border-yellow-400', 'opacity-100');
                                    };
                                    modalGalleryThumbs.appendChild(th);
                                });
                            } else {
                                modalGalleryThumbs.classList.add('hidden');
                                modalGalleryThumbs.innerHTML = '';
                            }

                            // Video
                            const videoCont = document.getElementById('modalVideoContainer');
                            if (item.video) {
                                document.getElementById('modalIframe').src = `https://www.youtube.com/embed/${item.video}`;
                                videoCont.classList.remove('hidden');
                            } else {
                                document.getElementById('modalIframe').src = '';
                                videoCont.classList.add('hidden');
                            }

                            // Show modal
                            caseModal.classList.remove('hidden');
                            caseModal.classList.add('flex');
                            document.body.style.overflow = 'hidden';

                            // Trigger anim
                            void caseModal.offsetWidth;
                            caseModal.classList.remove('opacity-0');
                            modalContent.classList.remove('scale-95');
                            modalContent.classList.add('scale-100');
                        });

                        casesGrid.appendChild(card);
                    });

                    renderCasesPagination();
                }

                if (casesData.length > 0) {
                    renderCases(currentPage);
                } else {
                    casesGrid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500">尚無相關案例。</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching cases:', error);
                casesGrid.innerHTML = '<div class="col-span-full py-20 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl mt-8">無法載入實績案例。<br><span class="text-sm mt-2 block opacity-80">若是直接開啟本機 HTML 檔案，瀏覽器安全機制會阻擋讀取 JSON 資料檔，請使用 Local Server 執行或等候上傳發布。</span></div>';
            });
    }

    // --- Dynamic Rendering Logic for News ---
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        fetch('data/news.json')
            .then(response => response.json())
            .then(data => {
                let newsContent = data.items ? [...data.items] : []; // 直接使用原始順序

                const itemsPerPage = 3;
                let currentPage = 1;

                function renderNewsPagination() {
                    let existingPagination = document.getElementById('news-pagination-wrapper');
                    if (existingPagination) existingPagination.remove();

                    const totalPages = Math.ceil(newsContent.length / itemsPerPage);
                    if (totalPages <= 1) return;

                    const paginationContainer = document.createElement('div');
                    paginationContainer.id = 'news-pagination-wrapper';
                    paginationContainer.className = 'col-span-full flex flex-wrap justify-center mt-12 gap-3 pb-8';

                    for (let i = 1; i <= totalPages; i++) {
                        const btn = document.createElement('button');
                        btn.textContent = i;
                        if (i === currentPage) {
                            btn.className = 'w-10 h-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center transition shadow-lg scale-105';
                        } else {
                            btn.className = 'w-10 h-10 rounded-full border border-white/20 text-gray-400 font-bold flex items-center justify-center hover:bg-white/10 hover:text-white transition';
                        }

                        btn.onclick = () => {
                            currentPage = i;
                            renderNews(currentPage);
                            const target = document.getElementById('news');
                            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        };
                        paginationContainer.appendChild(btn);
                    }
                    newsGrid.appendChild(paginationContainer);
                }

                function renderNews(page) {
                    newsGrid.innerHTML = '';

                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageItems = newsContent.slice(start, end);

                    pageItems.forEach((item, index) => {
                        const card = document.createElement('div');
                        card.className = 'reveal delay-100 p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-yellow-400/30 transition flex flex-col h-full active shadow-lg cursor-pointer group';

                        const sourceHtml = item.source ? `<div class="text-[10px] text-gray-600 mt-4 border-t border-white/5 pt-3 tracking-widest uppercase">圖片來源：${item.source}</div>` : '';
                        const schematicHtml = item.is_schematic ? `<div class="absolute top-3 left-3 bg-red-500/90 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded backdrop-blur z-10 uppercase">示意圖</div>` : '';

                        card.innerHTML = `
                            <div class="image-zoom-container aspect-video mb-6 rounded-xl overflow-hidden relative border border-white/5 bg-[#111]">
                                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-tl from-[#111] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                ${schematicHtml}
                            </div>
                            <div class="flex items-center gap-3 mb-4">
                                <span class="px-3 py-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[10px] font-bold tracking-widest uppercase rounded-full">${item.tag || 'News'}</span>
                                <span class="text-xs text-gray-500 font-medium">${item.date || ''}</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 group-hover:text-yellow-400 transition leading-tight">${item.title}</h3>
                            <p class="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">${item.text}</p>
                            ${sourceHtml}
                        `;

                        card.addEventListener('click', () => {
                            if (!newsModal) return;
                            document.getElementById('newsModalImg').src = item.img || '';
                            document.getElementById('newsModalCategory').textContent = item.tag || 'News';
                            document.getElementById('newsModalDate').textContent = item.date || '';
                            document.getElementById('newsModalTitle').textContent = item.title || '';
                            const descText = item.text || '';
                            document.getElementById('newsModalDesc').innerHTML = descText.replace(/\n/g, '<br>');

                            newsModal.classList.remove('hidden');
                            newsModal.classList.add('flex');
                            document.body.style.overflow = 'hidden';

                            void newsModal.offsetWidth;
                            newsModal.classList.remove('opacity-0');
                            if (newsModalContent) {
                                newsModalContent.classList.remove('scale-95');
                                newsModalContent.classList.add('scale-100');
                            }
                        });

                        newsGrid.appendChild(card);
                    });

                    renderNewsPagination();
                }

                if (newsContent.length > 0) {
                    renderNews(currentPage);
                } else {
                    newsGrid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500">尚無最新消息。</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsGrid.innerHTML = '<div class="col-span-full py-20 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl mt-8">無法載入最新消息。<br><span class="text-sm mt-2 block opacity-80">若是直接開啟本機 HTML 檔案，瀏覽器安全機制會阻擋讀取 JSON 資料檔，請使用 Local Server 執行或等候上傳發布。</span></div>';
            });
    }
});

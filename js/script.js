document.addEventListener('DOMContentLoaded', function () {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
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

    // Smooth Scroll
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
    const caseModal = document.getElementById('case-modal'); // Renamed to specific
    if (caseModal) {
        const modal = document.getElementById('case-modal');
        const closeBtn = document.querySelector('.close-btn');
        const modalIframe = document.getElementById('modal-iframe');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalCapacity = document.getElementById('modal-capacity');
        const modalDesc = document.getElementById('modal-desc');

        const caseCards = document.querySelectorAll('.case-card');

        caseCards.forEach(card => {
            card.addEventListener('click', () => {
                // Get data from attributes
                const title = card.getAttribute('data-title');
                const date = card.getAttribute('data-date');
                const capacity = card.getAttribute('data-capacity');
                const desc = card.getAttribute('data-desc');
                const videoId = card.getAttribute('data-video');

                // Populate Modal
                modalTitle.textContent = title;
                modalDate.textContent = date;
                modalCapacity.textContent = capacity;
                modalDesc.textContent = desc;

                // Set YouTube src with autoplay
                modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

                // Show Modal
                modal.style.display = 'block';
                // Slight delay to allow display:block to apply before adding show class for transition
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);

                // Disable body scroll when modal is open
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                modalIframe.src = ''; // Stop video
                document.body.style.overflow = '';
            }, 300);
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                closeModal();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    // --- Contact Section Logic (New) ---
    const showFormBtn = document.getElementById('show-form-btn');
    const contactFormContainer = document.getElementById('contact-form-container');

    if (showFormBtn && contactFormContainer) {
        showFormBtn.addEventListener('click', () => {
            contactFormContainer.classList.add('show');
            // Smooth scroll to form
            const yOffset = -50;
            const y = contactFormContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Hide the button after clicking? Or keep it? keeping it is fine.
            showFormBtn.style.display = 'none'; // Hide button after opening form
        });
    }

    // --- News Detail Page Logic ---
    const newsDetailContainer = document.getElementById('news-detail-container');
    if (newsDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');

        // Full Content Data
        const newsContent = [
            {
                date: '2024-04-11',
                title: '光電共生，守護家園生態',
                img: 'images/news-sketch-1.png',
                text: `日力能源不僅致力於發電，更在乎環境的永續。

我們在最新的台南案場中，與當地生態專家合作，導入了生態友善的設計。我們特意保留了原本的植被緩衝區，並在太陽能板下方種植耐陰性的原生植物。

經過一年的觀察，我們驚喜地發現，這裡不僅成為了野兔、刺蝟等小動物們的庇護所，鳥類的築巢率也比周邊地區高出 30%。

這證明了綠能發展與生態保育並非零和遊戲，只要用心規劃，太陽能板不僅能遮陽降溫，更是守護土地的溫柔力量。達成科技與自然的完美平衡，是 Sun Energy 永遠的承諾。

此外，本案場也將作為「綠能教育基地」，定期開放學校與機關團體參觀，讓大眾親身體驗綠色能源與環境生態共榮共存的可能性。`
            },
            {
                date: '2024-03-25',
                title: '能源轉型，從社區教育做起',
                img: 'images/news-sketch-2.png',
                text: `綠色能源的推動需要眾人的參與，而教育是改變未來的關鍵。

本月我們與台中海線社區合作，舉辦了為期兩天的「小小能源工程師體驗營」。活動中，我們帶領社區孩童認識各種再生能源的原理，從太陽能、風能到生質能。

透過親手組裝太陽能車與風力發電機模型的過程，孩子們眼中閃爍著對科學的好奇光芒。我們相信，將永續的種子種在下一代的心中，是企業回饋社會最有價值的方式。

未來，我們也將持續推動類似的科普教育計畫，讓綠能知識走進更多校園與社區，包括舉辦親子共學講座、綠能繪本導讀等活動，讓節能減碳的理念深入每個家庭。`
            },
            {
                date: '2024-02-18',
                title: '漁電共生，創造雙贏新局',
                img: 'images/news-sketch-3.png',
                text: `面對傳統養殖漁業人口老化與氣候變遷的挑戰，「漁電共生」成為了產業升級的新契機。

Sun Energy 協助彰化沿海的養殖戶引入智慧化的漁電共生系統。透過在魚塭上方設置太陽能板，不僅產出了綠電，面板適度的遮蔽也避免了夏季水溫過高，減少了養殖魚類的熱緊迫。

此外，我們還導入了水質自動監測系統，讓漁民可以透過手機即時掌握水質數據。實施一年下來，不僅水產養殖的存活率提升了 15%，漁民更多了一筆穩定的綠能售電收益。

從單純的養殖到「發電+養魚」的雙重獲利模式，我們與漁民攜手，創造了產業與綠能的雙贏新局。未來我們計畫將此模式推廣至更多沿海鄉鎮，協助轉型。`
            }
        ];

        if (newsId !== null && newsContent[newsId]) {
            const data = newsContent[newsId];
            newsDetailContainer.innerHTML = `
                <div class="news-detail-header">
                    <span class="news-detail-date">${data.date}</span>
                    <h1 class="news-detail-title">${data.title}</h1>
                </div>
                <div class="news-detail-image">
                    <img src="${data.img}" alt="${data.title}">
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

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
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }, 300); // 300ms matches CSS transition
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
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
});

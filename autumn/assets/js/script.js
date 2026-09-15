/* ============================================================
   AUTUMN - CREATIVE PORTFOLIO HTML TEMPLATE
   JavaScript
   Author: ThemeLegend
   Version: 1.0.0
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== STICKY NAVBAR ===== */
    const navbar = document.getElementById('navbar');
    const heroSlider = document.querySelector('.hero-slider');
    const heroHeight = heroSlider ? heroSlider.offsetHeight : 0;
    const navToggle = document.getElementById('navToggle');
    const navInner = document.getElementById('navInner');

    if (navbar && heroSlider) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight - 100) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
                if (navInner) navInner.classList.remove('open');
                if (navToggle) navToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    /* ===== MOBILE NAV TOGGLE ===== */
    if (navToggle && navInner) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navInner.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (navInner.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        navInner.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navbar && navbar.classList.contains('sticky')) {
                    navInner.classList.remove('open');
                    navToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });
    }

    /* ===== HERO SLIDER ===== */
    const slides = document.querySelectorAll('.slide');
    const slideDots = document.querySelectorAll('.slide-dots .dot');
    let currentSlide = 2;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        slideDots.forEach((d, i) => d.classList.toggle('active', i === index));
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 10000);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    if (slides.length) {
        slideDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideShow();
            });
        });
        startSlideShow();
    }

    /* ===== FILTERABLE MASONRY ===== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allMasonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            allMasonryItems.forEach(item => {
                const cats = item.dataset.category || '';
                if (filter === 'all' || cats.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });

            buildLightboxCollection();
        });
    });

    /* ===== LIGHTBOX ===== */
    const lightbox       = document.getElementById('lightbox');
    const lightboxImg    = document.getElementById('lightboxImg');
    const lightboxClose  = document.getElementById('lightboxClose');
    const lightboxPrev   = document.getElementById('lightboxPrev');
    const lightboxNext   = document.getElementById('lightboxNext');
    const lightboxDots   = document.getElementById('lightboxDots');
    const lightboxCap    = document.getElementById('lightboxCaption');
    const lightboxCount  = document.getElementById('lightboxCounter');

    let lbCollection = [];
    let lbIndex = 0;

    function buildLightboxCollection() {
        lbCollection = [];
        allMasonryItems.forEach(item => {
            if (item.style.display !== 'none') {
                const title = item.querySelector('.item-title')?.textContent || 'Gallery Item';
                lbCollection.push({ src: item.dataset.img, title: title });
            }
        });
        renderLightboxDots();
    }

    function renderLightboxDots() {
        if (!lightboxDots) return;
        lightboxDots.innerHTML = '';
        lbCollection.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'lb-dot' + (i === lbIndex ? ' active' : '');
            dot.addEventListener('click', () => { lbIndex = i; updateLightbox(); });
            lightboxDots.appendChild(dot);
        });
    }

    function updateLightbox() {
        if (!lbCollection.length) return;
        const item = lbCollection[lbIndex];
        lightboxImg.src = item.src;
        lightboxCap.textContent = item.title;
        lightboxCount.textContent = (lbIndex + 1) + ' / ' + lbCollection.length;
        document.querySelectorAll('.lightbox-dots .lb-dot').forEach((d, i) => {
            d.classList.toggle('active', i === lbIndex);
        });
    }

    function openLightbox(src) {
        buildLightboxCollection();
        const idx = lbCollection.findIndex(x => x.src === src);
        lbIndex = idx >= 0 ? idx : 0;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    function lbPrevFn() {
        if (!lbCollection.length) return;
        lbIndex = (lbIndex - 1 + lbCollection.length) % lbCollection.length;
        updateLightbox();
    }

    function lbNextFn() {
        if (!lbCollection.length) return;
        lbIndex = (lbIndex + 1) % lbCollection.length;
        updateLightbox();
    }

    if (lightbox) {
        allMasonryItems.forEach(item => {
            item.addEventListener('click', () => openLightbox(item.dataset.img));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); lbPrevFn(); });
        lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); lbNextFn(); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lbPrevFn();
            if (e.key === 'ArrowRight') lbNextFn();
        });

        buildLightboxCollection();
    }

    /* ===== TEAM SLIDER ===== */
    const teamSlider = document.getElementById('teamSlider');
    const teamPrev = document.getElementById('teamPrev');
    const teamNext = document.getElementById('teamNext');

    if (teamSlider && teamPrev && teamNext) {
        const teamCards = teamSlider.querySelectorAll('.team-card');
        let teamIndex = 0;
        const teamTotal = teamCards.length;

        function getTeamVisible() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }

        function updateTeamSlider() {
            const visible = getTeamVisible();
            const cardWidth = teamCards[0].offsetWidth + 30;
            const maxIndex = Math.max(0, teamTotal - visible);
            if (teamIndex > maxIndex) teamIndex = maxIndex;
            if (teamIndex < 0) teamIndex = 0;
            teamSlider.style.transform = `translateX(-${teamIndex * cardWidth}px)`;
        }

        teamNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, teamTotal - getTeamVisible());
            if (teamIndex < maxIndex) { teamIndex++; updateTeamSlider(); }
        });

        teamPrev.addEventListener('click', () => {
            if (teamIndex > 0) { teamIndex--; updateTeamSlider(); }
        });

        window.addEventListener('resize', () => { teamIndex = 0; updateTeamSlider(); });
        updateTeamSlider();
    }

    /* ===== FULL-WIDTH SLIDER ===== */
    const fwSlides = document.querySelectorAll('.fw-slide');
    const fwDots = document.querySelectorAll('.fw-dots .fw-dot');
    let fwIndex = 0;

    function showFwSlide(index) {
        fwSlides.forEach((s, i) => s.classList.toggle('active', i === index));
        fwDots.forEach((d, i) => d.classList.toggle('active', i === index));
        fwIndex = index;
    }

    if (fwSlides.length) {
        fwDots.forEach((dot, i) => dot.addEventListener('click', () => showFwSlide(i)));

        let fwInterval = setInterval(() => {
            showFwSlide((fwIndex + 1) % fwSlides.length);
        }, 7000);
    }

    /* ===== FAQ ACCORDION ===== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-question');
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ===== BLOG MODAL ===== */
    const blogModal = document.getElementById('blogModal');
    const blogModalClose = document.getElementById('blogModalClose');
    const blogModalImg = document.getElementById('blogModalImg');
    const blogModalMeta = document.getElementById('blogModalMeta');
    const blogModalTitle = document.getElementById('blogModalTitle');
    const blogModalContent = document.getElementById('blogModalContent');

    const blogData = {
        '1': {
            title: 'Blog post with featured image 1',
            category: 'Autumn',
            date: 'Wed, 29 Jan 2020',
            img: 'https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1200&q=80',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>`
        },
        '2': {
            title: 'Blog post with image slider 2',
            category: 'Nature',
            date: 'Wed, 29 Jan 2020',
            img: 'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=1200&q=80',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>`
        },
        '3': {
            title: 'Blog post only text 3',
            category: 'Article',
            date: 'Wed, 29 Jan 2020',
            img: null,
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
        },
        '4': {
            title: 'Blog post only text 2',
            category: 'Article',
            date: 'Wed, 29 Jan 2020',
            img: null,
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>`
        },
        '5': {
            title: 'Blog post with image slider 4',
            category: 'Gallery',
            date: 'Wed, 29 Jan 2020',
            img: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&q=80',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>`
        },
        '6': {
            title: 'Blog post with video 2',
            category: 'Video',
            date: 'Wed, 29 Jan 2020',
            img: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>`
        }
    };

    if (blogModal) {
        document.querySelectorAll('.full-post').forEach(btn => {
            btn.addEventListener('click', () => {
                const blogId = btn.dataset.blog;
                const data = blogData[blogId];
                if (!data) return;

                blogModalTitle.textContent = data.title;
                blogModalMeta.innerHTML = `<i class="far fa-calendar-alt"></i> ${data.date} &nbsp;·&nbsp; ${data.category}`;
                blogModalContent.innerHTML = data.content;

                if (data.img) {
                    blogModalImg.style.backgroundImage = `url('${data.img}')`;
                } else {
                    blogModalImg.style.backgroundImage = 'none';
                    blogModalImg.style.backgroundColor = '#2a241e';
                }

                blogModal.classList.add('active');
                document.body.classList.add('no-scroll');
            });
        });

        function closeBlogModal() {
            blogModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        blogModalClose.addEventListener('click', closeBlogModal);
        blogModal.addEventListener('click', (e) => { if (e.target === blogModal) closeBlogModal(); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogModal.classList.contains('active')) closeBlogModal();
        });
    }

    /* ===== SCROLL REVEAL ===== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('scroll', revealOnScroll);

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===== CONTACT FORM (Front-end only) ===== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Front-end only demo — connect to your own backend here
            alert('Thank you! Your message has been received.');
            contactForm.reset();
        });
    }

});
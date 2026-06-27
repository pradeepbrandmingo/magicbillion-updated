document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. TABS - PROGRAM AT GLANCE
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const specsRows = document.querySelectorAll('.specs-row');

  // Specs data for each specialization
  const specsData = {
    general: {
      credits: '180 ECTS - EU Bologna standard',
      language: '100% English - No German required',
      mode: '100% Online from India',
      duration: '3 years (6 Semester)',
      schedule: 'Weekend batches - 5 to 6 hours/Weekend',
      postgrad: 'Eligible for Masters - Across the global',
      pathway: 'Opportunity Card'
    },
    digital: {
      credits: '120 ECTS - EU standard',
      language: '100% English - Tech Terms focus',
      mode: 'Hybrid (Online + Campus visits)',
      duration: '2 years (4 Semester)',
      schedule: 'Flexible online / Evening batches',
      postgrad: 'Eligible for Post-Study Visa in Germany',
      pathway: 'Direct Employment / Tech Visa'
    },
    sports: {
      credits: '180 ECTS - Steinbeis Standard',
      language: '100% English - Optional German prep',
      mode: 'Online + 2 weeks bootcamp in Munich',
      duration: '3 years (6 Semester)',
      schedule: 'Cohort-based customized schedules',
      postgrad: 'Sports Business Network Placement EU',
      pathway: 'EU Sports Partner Network'
    }
  };

  function updateSpecs(specialization) {
    const data = specsData[specialization];
    if (!data) return;

    // The order in the HTML structure: Credits, Language, Mode, Duration, Schedule, Post-Grad, Pathway
    const keys = ['credits', 'language', 'mode', 'duration', 'schedule', 'postgrad', 'pathway'];
    
    specsRows.forEach((row, index) => {
      const valueSpan = row.querySelector('.specs-value');
      if (valueSpan && keys[index]) {
        // Fade effect
        valueSpan.style.opacity = '0';
        setTimeout(() => {
          valueSpan.textContent = data[keys[index]];
          valueSpan.style.opacity = '1';
        }, 150);
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to current
      button.classList.add('active');
      
      const tabName = button.getAttribute('data-tab');
      updateSpecs(tabName);
    });
  });


  // ==========================================
  // 2. WHY GERMANY CAROUSEL SLIDER
  // ==========================================
  const germanyTrack = document.getElementById('germany-track');
  const germanyPrev = document.getElementById('germany-prev');
  const germanyNext = document.getElementById('germany-next');
  
  if (germanyTrack) {
    const getScrollParams = () => {
      const firstCard = germanyTrack.querySelector('.germany-card');
      const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 344;
      const maxScroll = germanyTrack.scrollWidth - germanyTrack.clientWidth;
      return { cardWidth, maxScroll };
    };

    if (germanyNext) {
      germanyNext.addEventListener('click', () => {
        const { cardWidth, maxScroll } = getScrollParams();
        if (germanyTrack.scrollLeft >= maxScroll - 10) {
          germanyTrack.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          germanyTrack.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
          });
        }
      });
    }

    if (germanyPrev) {
      germanyPrev.addEventListener('click', () => {
        const { cardWidth, maxScroll } = getScrollParams();
        if (germanyTrack.scrollLeft <= 10) {
          germanyTrack.scrollTo({
            left: maxScroll,
            behavior: 'smooth'
          });
        } else {
          germanyTrack.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
          });
        }
      });
    }
  }


  // ==========================================
  // 3. TALENT CAROUSEL SLIDER
  // ==========================================
  const talentTrack = document.getElementById('talent-track');
  const talentPrev = document.getElementById('talent-prev');
  const talentNext = document.getElementById('talent-next');
  const talentDotsContainer = document.getElementById('talent-dots');
  
  let currentTalentSlide = 0;
  const totalTalentSlides = document.querySelectorAll('.talent-slide').length;

  function getVisibleSlides() {
    if (window.innerWidth > 991) return 3;
    if (window.innerWidth > 767) return 2;
    return 1;
  }

  function setupTalentDots() {
    if (!talentDotsContainer) return;
    talentDotsContainer.innerHTML = '';
    
    const visibleSlides = getVisibleSlides();
    const dotsCount = Math.max(1, totalTalentSlides - visibleSlides + 1);
    
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.textContent = i + 1; // Show index number instead of a blank dot
      if (i === currentTalentSlide) dot.classList.add('active');
      dot.setAttribute('data-slide', i);
      
      dot.addEventListener('click', () => {
        updateTalentSlider(i);
      });
      
      talentDotsContainer.appendChild(dot);
    }
  }

  function updateTalentSlider(index) {
    const visibleSlides = getVisibleSlides();
    const maxIndex = Math.max(0, totalTalentSlides - visibleSlides);
    
    if (index < 0) {
      index = maxIndex;
    } else if (index > maxIndex) {
      index = 0;
    }
    
    currentTalentSlide = index;
    
    const firstSlide = talentTrack ? talentTrack.querySelector('.talent-slide') : null;
    const sliderWrapper = document.querySelector('.talent-slider-wrapper');
    if (firstSlide) {
      if (window.innerWidth <= 768 && sliderWrapper) {
        // Mobile: Scroll-based smooth scrollTo
        const cardWidth = firstSlide.offsetWidth;
        const gap = 16; // mobile gap
        sliderWrapper.scrollTo({
          left: currentTalentSlide * (cardWidth + gap),
          behavior: 'smooth'
        });
      } else if (talentTrack) {
        // Desktop: Translation-based transition
        const cardWidth = firstSlide.offsetWidth;
        const gap = 24; // desktop gap
        talentTrack.style.transform = `translateX(-${currentTalentSlide * (cardWidth + gap)}px)`;
      }
    }
    
    // Update active dots
    if (talentDotsContainer) {
      const dots = talentDotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, dotIdx) => {
        dot.classList.remove('active');
        if (dotIdx === currentTalentSlide) {
          dot.classList.add('active');
        }
      });
    }
  }

  if (talentPrev && talentNext && talentTrack) {
    talentPrev.addEventListener('click', () => {
      updateTalentSlider(currentTalentSlide - 1);
    });

    talentNext.addEventListener('click', () => {
      updateTalentSlider(currentTalentSlide + 1);
    });

    // Touch events for mobile swipe gestures (Desktop only, mobile has native scroll)
    const sliderWrapper = document.querySelector('.talent-slider-wrapper');
    if (sliderWrapper) {
      let touchStartX = 0;
      let touchEndX = 0;
      const minSwipeDistance = 50;

      sliderWrapper.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768) return;
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderWrapper.addEventListener('touchend', (e) => {
        if (window.innerWidth <= 768) return;
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
          if (swipeDistance > 0) {
            updateTalentSlider(currentTalentSlide + 1);
          } else {
            updateTalentSlider(currentTalentSlide - 1);
          }
        }
      }, { passive: true });

      // Update dots on manual scroll (mobile only)
      let isScrolling;
      sliderWrapper.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(() => {
            const firstSlide = talentTrack ? talentTrack.querySelector('.talent-slide') : null;
            if (firstSlide) {
              const cardWidth = firstSlide.offsetWidth;
              const gap = 16; // mobile gap
              const index = Math.round(sliderWrapper.scrollLeft / (cardWidth + gap));
              if (index !== currentTalentSlide && index >= 0 && index < totalTalentSlides) {
                currentTalentSlide = index;
                if (talentDotsContainer) {
                  const dots = talentDotsContainer.querySelectorAll('.dot');
                  dots.forEach((dot, dotIdx) => {
                    dot.classList.remove('active');
                    if (dotIdx === currentTalentSlide) {
                      dot.classList.add('active');
                    }
                  });
                }
              }
            }
          }, 100);
        }
      }, { passive: true });
    }

    // Initialize
    setupTalentDots();
    updateTalentSlider(0);

    // Re-setup on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupTalentDots();
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalTalentSlides - visibleSlides);
        if (currentTalentSlide > maxIndex) {
          currentTalentSlide = maxIndex;
        }
        updateTalentSlider(currentTalentSlide);
      }, 100);
    });
  }


  // ==========================================
  // 4. FAQ ACCORDION
  // ==========================================
  const faqCards = document.querySelectorAll('.faq-card');

  // Initialize default active card
  const defaultActiveCard = document.querySelector('.faq-card.active');
  if (defaultActiveCard) {
    const body = defaultActiveCard.querySelector('.faq-card-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.style.marginTop = '12px';
    }
  }

  faqCards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // Close all first
      faqCards.forEach(c => {
        c.classList.remove('active');
        const icon = c.querySelector('.faq-icon');
        if (icon) {
          icon.textContent = '+';
        }
        const body = c.querySelector('.faq-card-body');
        if (body) {
          body.style.maxHeight = null;
          body.style.marginTop = null;
        }
      });
      
      // Toggle current
      if (!isActive) {
        card.classList.add('active');
        const icon = card.querySelector('.faq-icon');
        if (icon) {
          icon.textContent = '—';
        }
        const body = card.querySelector('.faq-card-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
          body.style.marginTop = '12px';
        }
      }
    });
  });


  // ==========================================
  // 5. HERO FORM SUBMISSION (Demo feedback removed to prevent conflict with actual submission scripts)
  // ==========================================


  // ==========================================
  // 6. MOBILE HAMBURGER MENU TOGGLE
  // ==========================================
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerToggle && navMenu) {
    hamburgerToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside header/menu
    document.addEventListener('click', (e) => {
      const header = document.querySelector('.main-header');
      if (header && !header.contains(e.target)) {
        hamburgerToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 7. STEP-BY-STEP JOURNEY — dots on path
  // ==========================================
  const journeySection = document.querySelector('.journey-section');
  const journeyPath = document.querySelector('.journey-line-svg path');
  const journeyNodes = document.querySelectorAll('.journey-node');

  // Place each node dot exactly ON the SVG path using getPointAtLength()
  function positionNodesOnPath() {
    if (!journeyPath || !journeyNodes.length) return;

    const wrapper = document.querySelector('.journey-map-wrapper');
    if (!wrapper) return;

    const svgEl = document.querySelector('.journey-line-svg svg');
    if (!svgEl) return;

    const totalLength = journeyPath.getTotalLength();
    const count = journeyNodes.length;

    // Evenly spread nodes along the path
    // Slight offsets: start at 2% and end at 98% of total length
    const startFrac = 0.02;
    const endFrac   = 0.98;

    // Get wrapper bounding rect for coordinate mapping
    const wrapperRect = wrapper.getBoundingClientRect();
    const svgRect     = svgEl.getBoundingClientRect();

    journeyNodes.forEach((node, i) => {
      const frac = startFrac + (endFrac - startFrac) * (i / (count - 1));
      const len  = frac * totalLength;

      // getPointAtLength returns SVG coordinate space point
      const pt = journeyPath.getPointAtLength(len);

      // Convert SVG point to wrapper-relative percentage
      // SVG uses viewBox coords; we need pixel offset relative to wrapper
      const svgViewBox = svgEl.viewBox.baseVal; // e.g. {x:0,y:0,w:1200,h:340}
      const scaleX = svgRect.width  / svgViewBox.width;
      const scaleY = svgRect.height / svgViewBox.height;

      // Pixel offset from wrapper top-left
      const pxX = (svgRect.left - wrapperRect.left) + pt.x * scaleX;
      const pxY = (svgRect.top  - wrapperRect.top)  + pt.y * scaleY;

      // Apply as absolute % of wrapper
      node.style.left = (pxX / wrapperRect.width  * 100) + '%';
      node.style.top  = (pxY / wrapperRect.height * 100) + '%';
    });
  }

  // Run after layout is complete
  function initJourney() {
    positionNodesOnPath();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          journeySection.classList.add('active');
          observer.unobserve(journeySection);
        }
      });
    }, { threshold: 0.15 });

    if (journeySection) observer.observe(journeySection);
  }

  // Re-position on resize
  let journeyResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(journeyResizeTimer);
    journeyResizeTimer = setTimeout(positionNodesOnPath, 100);
  });

  // Small delay so browser finishes rendering SVG before we measure
  setTimeout(initJourney, 100);


  // ==========================================
  // 8. GERMAN PROGRAMS CAROUSEL
  // ==========================================
  const programsTrack = document.getElementById('programs-track');
  const programsDots = document.querySelectorAll('#programs-dots .dot');

  if (programsTrack && programsDots.length) {
    const updateActiveDot = (activeIndex) => {
      programsDots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    programsDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        const card = programsTrack.querySelector('.program-card');
        if (card) {
          const cardWidth = card.offsetWidth;
          const gap = 24; // matches CSS gap
          programsTrack.scrollTo({
            left: slideIndex * (cardWidth + gap),
            behavior: 'smooth'
          });
          updateActiveDot(slideIndex);
        }
      });
    });

    // Sync dots on scroll
    let scrollTimeout;
    programsTrack.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const card = programsTrack.querySelector('.program-card');
        if (card) {
          const cardWidth = card.offsetWidth;
          const gap = 24;
          const index = Math.round(programsTrack.scrollLeft / (cardWidth + gap));
          if (index >= 0 && index < programsDots.length) {
            updateActiveDot(index);
          }
        }
      }, 100);
    }, { passive: true });
  }


  // ==========================================
  // 9. EXAM PREP CAROUSEL & PROGRESS BAR
  // ==========================================
  const examprepTrack = document.getElementById('examprep-track');
  const examprepPrev = document.getElementById('examprep-prev');
  const examprepNext = document.getElementById('examprep-next');
  const examprepProgress = document.getElementById('examprep-progress');

  if (examprepTrack) {
    const getScrollParams = () => {
      const firstCard = examprepTrack.querySelector('.exam-card');
      const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 374; // card width + gap
      const maxScroll = examprepTrack.scrollWidth - examprepTrack.clientWidth;
      return { cardWidth, maxScroll };
    };

    // Click navigation (Non-looping with dynamic disabled states)
    if (examprepNext) {
      examprepNext.addEventListener('click', () => {
        const { cardWidth } = getScrollParams();
        examprepTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }

    if (examprepPrev) {
      examprepPrev.addEventListener('click', () => {
        const { cardWidth } = getScrollParams();
        examprepTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }

    // Scroll progress bar and navigation buttons sync
    const updateSliderState = () => {
      // 1. Progress Bar Update
      if (examprepProgress) {
        const scrollPct = examprepTrack.scrollLeft / (examprepTrack.scrollWidth - examprepTrack.clientWidth);
        const safePct = Math.max(0, Math.min(1, isNaN(scrollPct) ? 0 : scrollPct));
        // The progress-bar width is 40%, so we move the left property from 0% to 60%
        examprepProgress.style.left = (safePct * 60) + '%';
      }

      // 2. Buttons Active/Disabled State Update
      const { maxScroll } = getScrollParams();
      const scrollLeft = examprepTrack.scrollLeft;

      if (maxScroll <= 10) {
        if (examprepPrev) examprepPrev.disabled = true;
        if (examprepNext) examprepNext.disabled = true;
        return;
      }

      if (examprepPrev) examprepPrev.disabled = (scrollLeft <= 10);
      if (examprepNext) examprepNext.disabled = (scrollLeft >= maxScroll - 10);
    };

    examprepTrack.addEventListener('scroll', updateSliderState, { passive: true });
    
    // Initial call
    setTimeout(updateSliderState, 100);
  }

});

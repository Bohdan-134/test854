const swiper = new Swiper('.swiper.swiper-form', {
    spaceBetween: 20,
    loop: true,
    autoHeight: true,
    pagination: {
      el: '.swiper-form .swiper-pagination',
      clickable: true,
    },
    simulateTouch: true,
    touchRatio: 1,
    grabCursor: true
});

document.querySelectorAll('.custom-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
      swiper.slideTo(index);
    });
});

swiper.on('slideChange', () => {
    document.querySelectorAll('.custom-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === swiper.realIndex);
    });
});


const swiperType1 = new Swiper('.swiper.type1', {
    slidesPerView: 2.5,
    spaceBetween: 40,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.5,
      },
      0: {
        slidesPerView: 1,
      },
    },
  });




  let whyJoinSwiper = null;

  function toggleWhyJoinSwiper() {
    const breakpoint = window.matchMedia('(max-width: 768px)');
    const swiperEl = document.querySelector('.why-join-swiper');
  
    if (!swiperEl) return;
  
    if (breakpoint.matches && !whyJoinSwiper) {
      whyJoinSwiper = new Swiper('.why-join-swiper', {
        slidesPerView: 1,
        spaceBetween: 20
      });
    } else if (!breakpoint.matches && whyJoinSwiper) {
      whyJoinSwiper.destroy(true, true);
      whyJoinSwiper = null;
    }
  }
  
  window.addEventListener('load', toggleWhyJoinSwiper);
  window.addEventListener('resize', toggleWhyJoinSwiper);




  const platformSwiper = new Swiper('.platform-swiper', {
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
      },
      0: {
        slidesPerView: 1,
      }
    }
  });

  document.querySelectorAll('[data-scroll="to-form"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('form-login');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  function updateDinamicButtonText() {
    const button = document.querySelector('.dinamic-text');
    if (!button) return;
  
    if (window.innerWidth <= 768) {
      button.textContent = 'Sign up now';
    } else {
      button.textContent = 'Write to her';
    }
  }
  
  updateDinamicButtonText();
  
  window.addEventListener('resize', updateDinamicButtonText);
document.addEventListener("DOMContentLoaded", (event) => {

  const navToggle = document.getElementById('nav-toggle');

  modalInit();

  
  document.querySelectorAll('input[type=tel]')?.forEach((input) => {
    
    const maskOptions = {
      mask: '+{7}(000)000-00-00'
    };
    const mask = IMask(input, maskOptions);
  
  });
  
  navToggle?.addEventListener('click', function() {
  
    navToggle.classList.toggle('nav-toggle--active');
    document.getElementById('header').classList.toggle('header--nav-active');
    document.body.classList.toggle('overflow-hidden')
    
  });

  const experienceSlider = new Swiper('.experience__slider', {
    slidesPerView: 1, // один слайд за раз
    spaceBetween: 20, // отступ между слайдами (по желанию)
    navigation: {
      nextEl: '.experience__slider-next',
      prevEl: '.experience__slider-prev',
    },
  });
  

})





function modalInit() {

  const openModal = document.querySelectorAll('[data-modal]');
  const modalClose = document.querySelectorAll('[data-close-modal]');

  if( openModal ) {

    openModal.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = button.dataset.modal;
    
        const modal = document.getElementById(modalId);
  
        if( modal ) {
  
          document.body.classList.add('overflow-hidden');
          modal.classList.add('modal--active');

          if( this.hasAttribute('data-title') ) {
              modal.querySelector('input[name=source]').value = this.getAttribute('data-title')
          }
  
        }
  
      });
    });
  
  }
  
  if( modalClose ) {
  
    modalClose.forEach(function(button) {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        const source = modal.querySelector('input[name=source]');
        modal.classList.remove('modal--active');
        if(source) {
          source.value = '';
        }
        if( !document.querySelector('.modal--active') ) {
          document.body.classList.remove('overflow-hidden');
        }
      });
    });
  
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const activeModal = document.querySelector('.modal--active');
      if (activeModal) {
        const source = activeModal.querySelector('input[name=source]');
        activeModal.classList.remove('modal--active');
        if (source) {
          source.value = '';
        }
        if (!document.querySelector('.modal--active')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }
  });

  document.addEventListener('click', function(e) {
    if( e.target.classList.contains('modal--active') ) {
      e.target.querySelector('[data-close-modal]').click();
    }
  })


}
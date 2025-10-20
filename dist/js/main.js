document.addEventListener("DOMContentLoaded", (event) => {

  const navToggle = document.getElementById('nav-toggle');

  modalInit();
  initFileAttachments();

  
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

  document.querySelectorAll('.experience__slider')?.forEach((sliderEl, index) => {
    const nextBtn = sliderEl.closest('.experience__block').querySelector('.experience__slider--nav--next');
    const prevBtn = sliderEl.closest('.experience__block').querySelector('.experience__slider--nav--prev');

    new Swiper(sliderEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
    });
  });
  

})

function initFileAttachments() {
    document.querySelectorAll('.form__attachment').forEach(wrapper => {
        const input = wrapper.querySelector('.form__attachment-input');
        const label = wrapper.querySelector('.form__attachment-label');
        const btn = wrapper.querySelector('.form__attachment-icon');
        const span = label.querySelector('span');
        const defaultText = label.dataset.labelText;

        if (!input || !label || !span || !btn) return;

        input.addEventListener('click', () => {
            input.value = '';
        });

        input.addEventListener('change', () => {
            const file = input.files[0];

            if (file) {
                let fileName = file.name;
                const maxLength = 15;

                if (fileName.length > maxLength) {
                    const ext = fileName.split('.').pop();
                    const baseName = fileName.slice(0, maxLength - ext.length - 4);
                    fileName = `${baseName}...${ext}`;
                }

                span.textContent = fileName;
                wrapper.classList.add('added');
            } else {
                span.textContent = defaultText;
                wrapper.classList.remove('added');
            }
        });

        btn.addEventListener('click', e => {
            e.preventDefault();
            input.value = '';
            span.textContent = defaultText;
            wrapper.classList.remove('added');
        });
    });
}



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
window.addEventListener('load', function(){

    // GLOBAL ENV //
	const body = document.querySelector('body')
	const header = document.querySelector('header')




	// MODAL OPEN //
    function initModal(modalSelector, modalOpenButtonSelector) {
        if(!modalSelector && !modalOpenButtonSelector) return
        const modal = document.querySelector(modalSelector)
    	const openModalButton = document.querySelector(modalOpenButtonSelector)
        const closeModalButton = modal?.querySelector('.js-modal-close')
        const isOpenClass = 'is-open'

        openModalButton?.addEventListener('click', openModalHandler )

        function openModalHandler(){
            openModalAction()
            closeModalButton.addEventListener('click', closeModalHandler )
            document.addEventListener('keydown', closeModalKeyAction() );
        }
        function closeModalHandler(){
            closeModalAction()
            closeModalButton.removeEventListener('click', closeModalHandler )
        }
        function closeModalKeyAction() {
            const callback = function(event) {
                if(event.key === "Escape") {
                    closeModalHandler()
                    document.removeEventListener('keydown', callback);
                }
            }
            return callback;
        }
        function openModalAction(){
            modal.classList.add(isOpenClass)
            body?.classList.add('open-menu')
            header?.classList.add('open-menu')
        }
        function closeModalAction(){
            modal.classList.remove(isOpenClass)
            body?.classList.remove('open-menu')
            header?.classList.remove('open-menu')
        }
    }
    
    initModal('.js-callback-modal', '.js-modal-open')
	// END MODAL OPEN //






    // PHONE MASK //
    function initPhoneMask(inputSelector){

        document.querySelectorAll(inputSelector).forEach( input =>  {
            let keyCode;
            function mask(event) {
                event.keyCode && (keyCode = event.keyCode);
                let pos = this.selectionStart;
                if (pos < 3) event.preventDefault()
                let matrix = "+7 (___) ___-__-__",
                    i = 0,
                    def = matrix.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, ""),
                    newValue = matrix.replace(/[_\d]/g, function (a) {
                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                    });
                i = newValue.indexOf("_");
                if (i != -1) {
                    i < 5 && (i = 3);
                    newValue = newValue.slice(0, i);
                }
                let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                    function (a) {
                        return "\\d{1," + a.length + "}";
                    }).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = newValue;
                if (event.type == "blur" && this.value.length < 5) this.value = "";
            }
    
            input.addEventListener("input", mask, false);
            input.addEventListener("focus", mask, false);
            input.addEventListener("blur", mask, false);
            input.addEventListener("keydown", mask, false);
            input.addEventListener('mouseup', event => {
              event.preventDefault()
              if (input.value.length < 4) {
                input.setSelectionRange(4, 4)
              } else {
                input.setSelectionRange(input.value.length, input.value.length)
              }
            })
        })
    }
    
    initPhoneMask('.js-phone-mask')
    // END PHONE MASK //
 



    // CONSOLE LOG FORM DATA //
    function logFormData(formSelector){
        const form = document.querySelector(formSelector)

        function serializeForm(formNode) {
            const { elements } = formNode
            const data = Array.from(elements)
                .filter( (item) => !!item.name)
                .map( (element) => {
                    const { name, value } = element
                    return { name, value }
                })
            console.log(data)
        }

        function handleFormSubmit(event) {
            event.preventDefault()
            serializeForm(form)
            event.target.reset()
        }

        form.addEventListener('submit', handleFormSubmit)
    }

    logFormData('.callback-form')
    // END CONSOLE LOG FORM DATA //






	/* Catalog button HOVER ANIMATION */
	const hoverAnime = anime.timeline({
		autoplay: false,
	})

	const hoverBtn = document.querySelector('.hover-anim')
	const hoverBtnAnim = hoverBtn.querySelector('span')

	if(hoverBtn) {
		hoverAnime
		.add({
			targets: hoverBtnAnim,
			easing: 'easeInOutExpo',
			translateY: [0, -25],
			duration: 900,
		}, "-=300")
	
		hoverBtn.addEventListener("mouseenter", () => { 
			if (hoverAnime.direction === "reverse") {
				hoverAnime.reverse()
				hoverAnime.restart()
			}
			hoverAnime.play();
		})
		
		hoverBtn.addEventListener("mouseleave", () => {
		
			hoverAnime.reverse();
			if ( hoverAnime.progress === 100 ) { hoverAnime.play(); }
		
		})
	}
	/* END Catalog button HOVER ANIMATION */




})
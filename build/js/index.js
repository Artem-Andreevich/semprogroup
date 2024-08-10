window.addEventListener('load', function(){
    


    // GLOBAL ENV //
	const body = document.querySelector('body')
	const header = document.querySelector('header')
    const headerFixedRange = 50
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)



	// MODAL OPEN //
    function initModal(modalSelector, modalOpenButtonSelector, isOpenClass = 'is-open') {
        const modal = document.querySelector(modalSelector)
    	const openModalButton = document.querySelector(modalOpenButtonSelector)
        const closeModalButton = modal?.querySelector('.js-modal-close')
        if(!modal || !openModalButton || !closeModalButton) return

        openModalButton.addEventListener('click', openModalHandler )

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
    function formData(formSelector){
        const form = document.querySelector(formSelector)
        const successForm = form?.querySelector('.form__success')
        if(!form) return

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
            successForm?.classList.add('show')
            setTimeout( () => {
                successForm?.classList.remove('show')
            }, 1000)
        }
        form.addEventListener('submit', handleFormSubmit)
    }

    formData('.callback-form')
    // END CONSOLE LOG FORM DATA //



    // TEXT HOVER ANIMATION //
    function textHoverAnim(animSelector) {
        const animNode = document.querySelectorAll(animSelector)
        animNode?.forEach( el => {
            const innerSpan = el.querySelector('span').innerHTML
            el.querySelector('span').remove()
            el.insertAdjacentHTML('beforeend', `<span class="text-animation">
                <span>${innerSpan}</span>
                <span>${innerSpan}</span>
            </span>`)
        })
    }
    !isMobile && textHoverAnim('.hover-anim')
    // END TEXT HOVER ANIMATION //



    /* HEADER FIXED ON SCROLL */
    function initHeaderFixed(header) {
        if(!header) return
        let currentScroll = 0

        window.addEventListener('scroll', () => {
            currentScroll = window.scrollY
            currentScroll > headerFixedRange ? header.classList.add('is-fixed') : header.classList.remove('is-fixed')
        })
    }
    initHeaderFixed(header)
	/* END HEADER FIXED ON SCROLL */



	/* FULL SCREEN PLAYER */
    function initFullscreenPlayer(button, player) {
        const openPlayerButton = document.querySelector(button)
        const playerFS = document.querySelector(player)
        const video = playerFS?.querySelector('video')
        const closePlayerButton = playerFS?.querySelector('.js-close-player')
        if(!openPlayerButton || !playerFS || !video || !closePlayerButton) return

        function exitFullscreen() {
            document.exitFullscreen()
        }

        function fullscreenchanged() {
            if (document.fullscreenElement) {
                closePlayerButton.addEventListener('click', exitFullscreen)
            } else {
                video.pause()
                video.currentTime = 0
                closePlayerButton.removeEventListener('click', exitFullscreen)
            }
        }

        !isMobile && playerFS.addEventListener("fullscreenchange", fullscreenchanged);

        openPlayerButton.addEventListener("click", () => {
            if (!document.fullscreenElement && !isMobile) {
                playerFS?.requestFullscreen()
                    .then(() => video.play())
                    .catch((err) => console.error(err))
            } else {
                video.play()
            }
        });
    }
    initFullscreenPlayer('.js-open-player', '.js-fs-player')
	/* END FULL SCREEN PLAYER */
})
(function () {
    var overlay = document.getElementById("placementReportOverlay");
    var closeBtn = document.getElementById("prCloseBtn");
    var cloneArea = document.getElementById("pr-form-clone-area");
    var formEl = document.getElementById("frmContact");
    var originalParent = formEl ? formEl.parentNode : null;
    var originalNextSibling = formEl ? formEl.nextSibling : null;
    var popupIsOpen = false;

    var HEADER_URL = "https://www.jaipuria.ac.in/Thank-you/";
    var POPUP_URL = "https://www.jaipuria.ac.in/wp-content/uploads/2026/04/Placement-Report.pdf";
    var LSQ_FORM = 'form[action="https://web.mxradon.com/t/FormTracker.aspx"]';

    // Intercept submit in capturing phase — runs BEFORE LSQ reads the field
    document.addEventListener("submit", function (e) {
        if (!e.target || !e.target.matches) return;
        if (!e.target.matches(LSQ_FORM)) return;
        if (popupIsOpen) {
            // Open PDF in new tab; let LSQ redirect current page to thank-you as normal
            window.open(POPUP_URL, "_blank");
            var field = e.target.querySelector('input[name="MXHRedirectUrl"]');
            if (field) field.value = HEADER_URL;
        }
    }, true);
})();

(function () {

    /* ---------- Config ---------- */
    var bnrSliderConfig = {
        autoPlayDelay: 2000,
        transitionDuration: 600
    };

    /* ---------- State ---------- */
    var bnrSliderState = {
        currentIndex: 0,
        totalSlides: 0,
        autoPlayTimer: null,
        isAnimating: false
    };

    /* ---------- DOM References ---------- */
    var bnrSliderEl = document.getElementById('bannerSlider');
    var bnrSlides = bnrSliderEl ? bnrSliderEl.querySelectorAll('.bnr-slider__slide') : [];
    var bnrDots = bnrSliderEl ? bnrSliderEl.querySelectorAll('.bnr-slider__dot') : [];
    var bnrPrevBtn = document.getElementById('bnrPrevBtn');
    var bnrNextBtn = document.getElementById('bnrNextBtn');

    /* ---------- Init ---------- */
    function bnrSliderInit() {
        if (!bnrSliderEl || bnrSlides.length === 0) return;

        bnrSliderState.totalSlides = bnrSlides.length;

        // Pehli slide already active hai HTML me, sirf autoplay shuru karo
        bnrSliderStartAutoPlay();

        // Arrow buttons
        if (bnrPrevBtn) {
            bnrPrevBtn.addEventListener('click', function () {
                bnrSliderGo(bnrSliderState.currentIndex - 1);
                bnrSliderResetAutoPlay();
            });
        }

        if (bnrNextBtn) {
            bnrNextBtn.addEventListener('click', function () {
                bnrSliderGo(bnrSliderState.currentIndex + 1);
                bnrSliderResetAutoPlay();
            });
        }

        // Dots
        bnrDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(dot.getAttribute('data-bnr-index'), 10);
                bnrSliderGo(idx);
                bnrSliderResetAutoPlay();
            });
        });

        // Hover pe autoplay pause
        bnrSliderEl.addEventListener('mouseenter', bnrSliderStopAutoPlay);
        bnrSliderEl.addEventListener('mouseleave', bnrSliderStartAutoPlay);

        // Touch / Swipe support
        bnrSliderBindSwipe();
    }

    /* ---------- Go to specific slide ---------- */
    function bnrSliderGo(index) {
        if (bnrSliderState.isAnimating) return;

        var total = bnrSliderState.totalSlides;

        // Circular looping
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;

        if (index === bnrSliderState.currentIndex) return;

        bnrSliderState.isAnimating = true;

        // Active slide hatao
        bnrSlides[bnrSliderState.currentIndex].classList.remove('bnr-slider__slide--active');
        bnrDots[bnrSliderState.currentIndex] && bnrDots[bnrSliderState.currentIndex].classList.remove('bnr-slider__dot--active');

        // Naya slide activate karo
        bnrSliderState.currentIndex = index;
        bnrSlides[index].classList.add('bnr-slider__slide--active');
        bnrDots[index] && bnrDots[index].classList.add('bnr-slider__dot--active');

        // Animation lock hata do transition ke baad
        setTimeout(function () {
            bnrSliderState.isAnimating = false;
        }, bnrSliderConfig.transitionDuration);
    }

    /* ---------- AutoPlay ---------- */
    function bnrSliderStartAutoPlay() {
        bnrSliderStopAutoPlay(); // pehle clear karo
        bnrSliderState.autoPlayTimer = setInterval(function () {
            bnrSliderGo(bnrSliderState.currentIndex + 1);
        }, bnrSliderConfig.autoPlayDelay);
    }

    function bnrSliderStopAutoPlay() {
        if (bnrSliderState.autoPlayTimer) {
            clearInterval(bnrSliderState.autoPlayTimer);
            bnrSliderState.autoPlayTimer = null;
        }
    }

    function bnrSliderResetAutoPlay() {
        bnrSliderStopAutoPlay();
        bnrSliderStartAutoPlay();
    }

    /* ---------- Touch / Swipe ---------- */
    function bnrSliderBindSwipe() {
        var bnrTouchStartX = 0;
        var bnrTouchEndX = 0;
        var bnrSwipeThreshold = 50; // pixels

        bnrSliderEl.addEventListener('touchstart', function (e) {
            bnrTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        bnrSliderEl.addEventListener('touchend', function (e) {
            bnrTouchEndX = e.changedTouches[0].screenX;
            var diff = bnrTouchStartX - bnrTouchEndX;

            if (Math.abs(diff) >= bnrSwipeThreshold) {
                if (diff > 0) {
                    // Left swipe → Next
                    bnrSliderGo(bnrSliderState.currentIndex + 1);
                } else {
                    // Right swipe → Prev
                    bnrSliderGo(bnrSliderState.currentIndex - 1);
                }
                bnrSliderResetAutoPlay();
            }
        }, { passive: true });
    }

    /* ---------- Start ---------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bnrSliderInit);
    } else {
        bnrSliderInit();
    }

})();


const placementBtn = document.getElementById('placementToggleBtn');
const placementView1 = document.getElementById('placementView1');
const placementView2 = document.getElementById('bannerSlider');

placementBtn.addEventListener('click', () => {
    placementView1.classList.toggle('placement-hidden');
    bannerSlider.classList.toggle('placement-hidden');
});

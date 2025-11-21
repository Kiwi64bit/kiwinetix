/**
 * Delegated click handler for all `.concept-card` elements.
 * Uses event delegation on `.concept-card-container` so dynamic cards are supported.
 */
$(".concept-card-container").on("click", ".concept-card", function (event) {
    /**
     * The jQuery-wrapped card element that was clicked.
     * @type {JQuery<HTMLElement>}
     */
    const $card = $(this);

    /**
     * The `.variables` container inside the clicked card.
     * @type {JQuery<HTMLElement>}
     */
    const $variablesContainer = $card.find(".variables");

    toggleCard($card, $variablesContainer);
});

$(".equation-card-container").on("click", ".equation-card", function (event) {
    /**
     * The jQuery-wrapped card element that was clicked.
     * @type {JQuery<HTMLElement>}
     */
    const $card = $(this);
    $card.toggleClass("flipped");
});

/* ------------------------------------------------------------------ */
/* ------------------------ Scroll Handler -------------------------- */
/* ------------------------------------------------------------------ */

const navbarProgress = document.getElementById("navbarProgress");
const mainSection = document.getElementById("main");
const scrollSections = document.querySelectorAll(".scroll-section");

(function loop() {
    const rect = mainSection.getBoundingClientRect();
    const y = mainSection.scrollTop;
    const amount = mainSection.scrollHeight - mainSection.clientHeight;
    const progress = y / amount;
    navbarProgress.style.setProperty("width", `${100 * progress}%`);

    scrollSections.forEach(
        /** @param {HTMLElement} section */
        section => {
            const visibility = calculateVerticalVisibility(section, rect.top, rect.bottom);
            if (visibility > 0.4) {
                section.classList.add("show");
            } else {
                section.classList.remove("show");
            }
        }
    );

    requestAnimationFrame(loop);
})();

/* ------------------------------------------------------------------ */
/* --------------------------- FUNCTIONS ---------------------------- */
/* ------------------------------------------------------------------ */

/**
 * Calculate how much an element is visible inside a range.
 * @param {HTMLElement} element
 * @param {number} start
 * @param {number} end
 */
function calculateVerticalVisibility(element, start, end) {
    const rect = element.getBoundingClientRect();

    if (rect.bottom <= start || rect.top >= end) return 0;

    const visible = Math.min(rect.bottom, end) - Math.max(rect.top, start);

    let ratio = 0;
    if (rect.height < end - start) {
        ratio = visible / rect.height;
    } else {
        ratio = visible / (end - start);
    }
    ratio = Math.min(Math.max(ratio, 0), 1);

    return ratio;
}

/**
 * Toggles the card's expanded/collapsed state.
 *
 * @param {JQuery<HTMLElement>} $card - The card to toggle.
 * @param {JQuery<HTMLElement>} $variablesContainer - The inner content container.
 */
function toggleCard($card, $variablesContainer) {
    if ($card.hasClass("expanded")) {
        collapseCard($card, $variablesContainer);
    } else {
        expandCard($card, $variablesContainer);
    }
}

/**
 * Expands a concept card and sets its max-height to allow CSS transitions.
 *
 * @param {JQuery<HTMLElement>} $card - The card being expanded.
 * @param {JQuery<HTMLElement>} $variablesContainer - The container being shown.
 */
function expandCard($card, $variablesContainer) {
    $card.addClass("expanded");

    /**
     * The actual full height of the content for animation.
     * @type {number}
     */
    const contentHeight = $variablesContainer.prop("scrollHeight");

    $variablesContainer.css("max-height", contentHeight + "px");
}

/**
 * Collapses a concept card and resets its max-height.
 *
 * @param {JQuery<HTMLElement>} $card - The card being collapsed.
 * @param {JQuery<HTMLElement>} $variablesContainer - The container being hidden.
 */
function collapseCard($card, $variablesContainer) {
    $card.removeClass("expanded");
    $variablesContainer.css("max-height", "0px");
}

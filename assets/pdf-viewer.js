(function () {
    const clientside = window.dash_clientside = window.dash_clientside || {};
    let resizeObserver;
    let observedContainer;
    let scrollObserver;
    let scrollFrame;

    clientside.pdfViewer = {
        measure(numPages, mode) {
            const container = document.getElementById("pdf-pages");
            if (!container) return clientside.no_update;
            const measureWidth = () => {
                const style = getComputedStyle(container);
                return Math.max(1, Math.floor(container.clientWidth
                    - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)));
            };
            if (observedContainer !== container) {
                resizeObserver?.disconnect();
                observedContainer = container;
                let previousWidth = measureWidth();
                resizeObserver = new ResizeObserver(() => {
                    const width = measureWidth();
                    if (width !== previousWidth) {
                        previousWidth = width;
                        clientside.set_props("pdf-viewport-width", {data: width});
                    }
                });
                resizeObserver.observe(container);
            }
            return measureWidth();
        },

        scroll(page, mode, children, itemClick, outlineClick, thumbnailClicks) {
            scrollObserver?.disconnect();
            if (scrollFrame) cancelAnimationFrame(scrollFrame);
            const container = document.getElementById("pdf-pages");
            if (!container || mode !== "continuous") return clientside.no_update;
            // Page wrappers can mount after Dash has delivered their children.
            const goToPage = () => {
                const target = container.querySelector('[data-page-number="' + page + '"]');
                if (!target) return false;
                const padding = parseFloat(getComputedStyle(container).paddingTop) || 0;
                const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
                container.scrollTo({top: offset + container.scrollTop - padding});
                scrollObserver?.disconnect();
                return true;
            };
            scrollFrame = requestAnimationFrame(() => {
                if (!goToPage()) {
                    scrollObserver = new MutationObserver(goToPage);
                    scrollObserver.observe(container, {childList: true, subtree: true});
                }
            });
            return clientside.no_update;
        }
    };
})();

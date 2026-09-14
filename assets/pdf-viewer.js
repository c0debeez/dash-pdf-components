(function () {
    const clientside = window.dash_clientside = window.dash_clientside || {};
    let resizeObserver;
    let observedContainer;
    let scrollObserver;
    let scrollFrame;

    function latestThumbnail(clicks) {
        return (clicks || []).filter(Boolean).reduce((latest, click) =>
            !latest || click.timestamp > latest.timestamp ? click : latest, null);
    }

    clientside.pdfViewer = {
        navigate(previousClicks, nextClicks, requestedPage, itemClick, outlineClick, thumbnailClicks, numPages, file, currentPage) {
            const propId = clientside.callback_context.triggered[0]?.prop_id || "";
            let page = Number(currentPage || 1);
            if (propId === "pdf-document.file") page = 1;
            else if (propId === "pdf-previous.n_clicks") page -= 1;
            else if (propId === "pdf-next.n_clicks") page += 1;
            else if (propId === "pdf-page-number.value") page = Number(requestedPage || page);
            else if (propId === "pdf-document.itemClickData" && itemClick) page = itemClick.pageNumber;
            else if (propId === "pdf-outline.itemClickData" && outlineClick) page = outlineClick.pageNumber;
            else if (propId.includes("pdf-thumbnail")) {
                const click = latestThumbnail(thumbnailClicks);
                if (!click) return [clientside.no_update, clientside.no_update];
                page = click.pageNumber;
            }
            page = Math.max(1, Math.min(Math.trunc(Number(page)) || 1, Number(numPages || page)));
            return [page, page];
        },

        zoom(zoomOut, zoomIn, fitClicks, scale, viewportWidth) {
            const propId = clientside.callback_context.triggered[0]?.prop_id || "";
            if (propId === "pdf-fit-width.n_clicks") return "fit";
            const current = scale === "fit" ? Number(viewportWidth || 600) / 600 : Number(scale || 1);
            const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
            const next = propId === "pdf-zoom-in.n_clicks"
                ? presets.find(value => value > current + 0.001) || 4
                : presets.slice().reverse().find(value => value < current - 0.001) || 0.25;
            return String(next);
        },

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
            document.querySelectorAll("[data-thumbnail-page]").forEach(thumbnail => {
                thumbnail.dataset.selected = String(Number(thumbnail.dataset.thumbnailPage) === Number(page));
            });
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
        },

        status(numPages, error, challenge, page) {
            const ready = Boolean(numPages);
            return ["/ " + (numPages || "-"), numPages || 4, !ready && !error && !challenge,
                !ready || page <= 1, !ready || page >= numPages, !ready];
        },
    };
})();

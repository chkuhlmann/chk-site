(function() {
    window.fetchWithTimeout = function(url, options = {}, timeoutMs = 10000) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(function() {
            controller.abort();
        }, timeoutMs);

        return fetch(url, {
            ...options,
            signal: controller.signal
        }).finally(function() {
            window.clearTimeout(timeoutId);
        });
    };
})();

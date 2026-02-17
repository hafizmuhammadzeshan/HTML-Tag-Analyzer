// Module to fetch HTML content from a URL
// Uses a CORS proxy to handle cross-origin requests

// Module to fetch HTML content from a URL
// Uses CORS proxies with fallbacks to handle cross-origin requests

const HtmlFetcher = {
  // Multiple CORS proxy URLs to try as fallbacks
  corsProxyUrls: [
    "https://api.codetabs.com/v1/proxy?quest=",
    "https://corsproxy.io/?",
    "https://api.allorigins.win/raw?url=",
    "https://thingproxy.freeboard.io/fetch/",
  ],

  /**
   * Tries to fetch using a specific proxy
   */
  async tryFetchWithProxy(proxyUrl, targetUrl) {
    let fullUrl;
    if (proxyUrl.includes("codetabs")) {
      fullUrl = proxyUrl + encodeURIComponent(targetUrl);
    } else if (proxyUrl.includes("thingproxy")) {
      fullUrl = proxyUrl + targetUrl;
    } else {
      fullUrl = proxyUrl + encodeURIComponent(targetUrl);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: { Accept: "text/html" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const htmlContent = await response.text();

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new Error("No HTML content received");
    }

    return htmlContent;
  },

  /**
   * Fetches HTML content from the given URL, trying multiple proxies if needed
   */
  async fetchHtml(url) {
    let lastError = null;

    // Try each proxy in order
    for (let i = 0; i < this.corsProxyUrls.length; i++) {
      try {
        return await this.tryFetchWithProxy(this.corsProxyUrls[i], url);
      } catch (error) {
        lastError = error;
        continue; // Try next proxy
      }
    }

    // If all proxies failed
    if (lastError) {
      if (lastError.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw new Error(
        "Network error. All CORS proxy services are unavailable. Please check your internet connection.",
      );
    }
  },
};

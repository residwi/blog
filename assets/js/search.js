// Search functionality using Lunr.js
(() => {
  "use strict";

  const searchModal = document.getElementById("search-modal");
  const searchToggle = document.getElementById("search-toggle");
  const searchClose = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchEmpty = document.getElementById("search-empty");

  if (
    !searchModal ||
    !searchToggle ||
    !searchClose ||
    !searchInput ||
    !searchResults ||
    !searchEmpty
  ) {
    return;
  }

  let searchIndex = null;
  let searchData = null;
  let searchTimeout;

  async function initializeSearch() {
    try {
      const response = await fetch(window.SEARCH_URL || "/search.json");
      searchData = await response.json();

      searchIndex = lunr(function () {
        this.ref("url");
        this.field("title", { boost: 10 });
        this.field("content");
        this.field("tags", { boost: 5 });

        searchData.forEach((doc) => {
          this.add(doc);
        });
      });
    } catch (error) {
      console.error("Failed to initialize search:", error);
    }
  }

  function performSearch(query) {
    if (!searchIndex || !query) {
      return [];
    }

    return searchIndex.search(query).map((result) => {
      const doc = searchData.find((d) => d.url === result.ref);
      return { ...doc, score: result.score };
    });
  }

  function displaySearchResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = "";
      searchEmpty.classList.remove("hidden");
      return;
    }

    searchEmpty.classList.add("hidden");

    searchResults.innerHTML = results
      .map((result) => {
        const typeLabel = result.type === "til" ? "TIL" : "Post";
        const typeBadgeClass =
          result.type === "til"
            ? "bg-ctp-green/10 text-ctp-green"
            : "bg-ctp-mauve/10 text-ctp-mauve";
        const excerpt = result.content.substring(0, 150) + "...";

        return `
      <a href="${result.url}" class="block px-4 py-2 mt-2 hover:bg-ctp-surface0 rounded-lg transition-colors">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 ${typeBadgeClass} rounded text-xs font-medium">
            ${typeLabel}
          </span>
          <span class="text-xs text-ctp-overlay1 font-mono">
            ${result.date}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-ctp-text mb-1">
          ${result.title}
        </h3>
        <p class="text-sm text-ctp-subtext1 line-clamp-2">
          ${excerpt}
        </p>
      </a>
    `;
      })
      .join("");
  }

  function closeSearch() {
    searchModal.classList.add("hidden");
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchEmpty.classList.add("hidden");
  }

  searchToggle.addEventListener("click", () => {
    searchModal.classList.remove("hidden");
    searchInput.focus();
    if (!searchIndex) initializeSearch();
  });

  searchClose.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
      closeSearch();
    }
  });

  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearch();
  });

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (!query) {
      searchResults.innerHTML = "";
      searchEmpty.classList.add("hidden");
      return;
    }

    searchTimeout = setTimeout(() => {
      displaySearchResults(performSearch(query));
    }, 300);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const firstResult = searchResults.querySelector("a");
      if (firstResult) firstResult.click();
    }
  });
})();

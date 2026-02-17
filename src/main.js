// Main application controller
// Coordinates all modules and handles user interactions

// Test mode: Set to true to test with sample data (useful when CORS proxy is unavailable)
const TEST_MODE = false;

// Generate a large test dataset to verify virtual scrolling works with 10,000+ items
function generateTestTags() {
  const tagTypes = [
    "div",
    "span",
    "p",
    "a",
    "img",
    "button",
    "input",
    "form",
    "ul",
    "li",
    "h1",
    "h2",
    "h3",
    "section",
    "article",
    "header",
    "footer",
    "nav",
    "main",
    "aside",
  ];
  const tags = [];

  // Generate 10,000+ tags with varying frequencies
  for (let i = 0; i < 12000; i++) {
    const randomTag = tagTypes[Math.floor(Math.random() * tagTypes.length)];
    tags.push(randomTag);
  }

  return tags;
}

// Get references to DOM elements
const urlInput = document.getElementById("urlInput");
const fetchButton = document.getElementById("fetchButton");
const searchInput = document.getElementById("searchInput");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const resultsContainer = document.getElementById("resultsContainer");
const resultsTitle = document.getElementById("resultsTitle");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const virtualScrollContainer = document.getElementById(
  "virtualScrollContainer",
);
const virtualScrollContent = document.getElementById("virtualScrollContent");

// Store the original tags data (before filtering)
let originalTags = [];

// Initialize the virtual scroller
VirtualScroller.init(virtualScrollContainer, virtualScrollContent);

/**
 * Shows loading state
 */
function showLoading() {
  loadingIndicator.style.display = "block";
  errorMessage.style.display = "none";
  resultsContainer.classList.remove("visible");
  emptyState.style.display = "none";
  fetchButton.disabled = true;
  searchInput.disabled = true;
}

/**
 * Hides loading state
 */
function hideLoading() {
  loadingIndicator.style.display = "none";
  fetchButton.disabled = false;
  searchInput.disabled = false;
}

/**
 * Shows an error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  resultsContainer.classList.remove("visible");
  emptyState.style.display = "none";
}

/**
 * Displays the tag results
 */
function displayResults(tags) {
  if (tags.length === 0) {
    emptyState.style.display = "block";
    resultsContainer.classList.remove("visible");
    return;
  }

  emptyState.style.display = "none";
  resultsContainer.classList.add("visible");

  // Update title and count
  resultsTitle.textContent = "Results";
  resultsCount.textContent = `${tags.length.toLocaleString()} tag${tags.length !== 1 ? "s" : ""}`;

  // Small delay to ensure container is visible before calculating dimensions
  setTimeout(() => {
    // Update virtual scroller with the tags
    VirtualScroller.setItems(tags);
  }, 10);
}

/**
 * Handles the fetch and analyze button click
 */
async function handleFetchAndAnalyze() {
  const url = urlInput.value.trim();

  // Validate URL
  if (!url) {
    showError("Please enter a URL");
    return;
  }

  try {
    showLoading();

    let tagNames;

    // Step 1: Fetch HTML content (or use test data)
    if (TEST_MODE) {
      // Use generated test tags for development/testing
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      tagNames = generateTestTags();
    } else {
      const htmlContent = await HtmlFetcher.fetchHtml(url);
      // Step 2: Parse HTML and extract all tags
      tagNames = HtmlParser.extractAllTags(htmlContent);
    }

    // Step 3: Count and sort tags
    const sortedTags = TagAnalyzer.analyzeTags(tagNames);

    // Store original tags for filtering
    originalTags = sortedTags;

    // Step 4: Display results
    hideLoading();
    displayResults(sortedTags);

    // Clear search input
    searchInput.value = "";
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

/**
 * Handles search input changes
 */
function handleSearch() {
  const searchQuery = searchInput.value.trim();

  // Filter tags based on search query
  const filteredTags = SearchFilter.filterTags(originalTags, searchQuery);

  // Update display with filtered results
  displayResults(filteredTags);
}

// Set up event listeners

// Fetch button click
fetchButton.addEventListener("click", handleFetchAndAnalyze);

// Enter key in URL input
urlInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleFetchAndAnalyze();
  }
});

// Search input with debouncing for better performance
let searchTimeout;
searchInput.addEventListener("input", () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Wait 300ms before filtering (debounce)
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 300);
});

// Enter key in search input
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    handleSearch();
  }
});

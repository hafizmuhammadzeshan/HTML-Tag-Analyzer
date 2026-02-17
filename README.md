# HTML Tag Analyzer

A JavaScript module that fetches, parses, and analyzes HTML documents, displaying tag statistics with efficient virtual scrolling for large datasets (10,000+ items).

## Features

- ✅ **Fetches HTML** from external URLs using CORS proxy
- ✅ **Safely parses HTML** using DOMParser (no script execution)
- ✅ **Extracts unique tags** and counts occurrences
- ✅ **Sorts by frequency** (highest first)
- ✅ **Virtual scrolling** - Only renders visible rows for optimal performance
- ✅ **Search filter** - Filter tags without re-rendering everything
- ✅ **Handles 10,000+ items** efficiently

## How to Use

1. Open `index.html` in a web browser
2. Enter a URL (e.g., `https://example.com`)
3. Click "Fetch & Analyze"
4. View tag statistics sorted by frequency
5. Use the search box to filter tags

## Project Structure

```
HTML-Tag-Analyzer/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Styling
└── src/
    ├── main.js            # Main application controller
    ├── htmlFetcher.js     # HTML fetching module
    ├── htmlParser.js      # HTML parsing module
    ├── tagAnalyzer.js     # Tag counting and sorting
    ├── virtualScroller.js # Virtual scrolling implementation
    └── searchFilter.js    # Search filter module
```

## Technical Details

### Virtual Scrolling
The application implements true virtualization:
- Only renders visible rows in the DOM
- Calculates visible range based on scroll position
- Uses absolute positioning with transforms for smooth scrolling
- Handles large datasets (10,000+ items) efficiently

### HTML Parsing
- Uses `DOMParser` API for safe HTML parsing
- Prevents XSS attacks by not executing scripts
- Extracts all tag names recursively from the DOM tree

### CORS Handling
- Uses multiple CORS proxy services with fallback support
- Automatically tries alternative proxies if one fails
- Provides user-friendly error messages

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Fetch API
- DOMParser API
- CSS Grid

## License

This project is created for demonstration purposes.

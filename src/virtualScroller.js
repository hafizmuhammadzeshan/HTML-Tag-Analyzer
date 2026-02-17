// Module to implement virtual scrolling for large lists
// Only renders visible items to maintain performance with 10,000+ items

const VirtualScroller = {
    // Configuration
    rowHeight: 50, // Height of each row in pixels
    bufferSize: 5, // Number of extra rows to render above and below visible area

    // Current state
    container: null,
    content: null,
    allItems: [],
    visibleStartIndex: 0,
    visibleEndIndex: 0,

    /**
     * Initializes the virtual scroller
     * @param {HTMLElement} containerElement - The scrollable container element
     * @param {HTMLElement} contentElement - The content wrapper element
     */
    init(containerElement, contentElement) {
        this.container = containerElement;
        this.content = contentElement;
        
        // Set up scroll event listener with throttling for performance
        let scrollTimeout;
        this.container.addEventListener('scroll', () => {
            // Clear previous timeout
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            // Use requestAnimationFrame for smooth scrolling
            scrollTimeout = requestAnimationFrame(() => {
                this.updateVisibleItems();
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateVisibleItems();
        });
    },

    /**
     * Sets the items to display and renders them
     * @param {Array<{tag: string, count: number}>} items - Array of tag objects to display
     */
    setItems(items) {
        this.allItems = items;
        this.updateVisibleItems();
    },

    /**
     * Updates which items are visible based on scroll position
     */
    updateVisibleItems() {
        if (!this.container || !this.content || this.allItems.length === 0) {
            this.content.style.height = '0px';
            this.content.innerHTML = '';
            return;
        }

        // Get current scroll position
        const scrollTop = this.container.scrollTop;
        
        // Calculate how many rows fit in the visible area
        const containerHeight = this.container.clientHeight;
        const visibleRowCount = Math.ceil(containerHeight / this.rowHeight);

        // Calculate which items should be visible
        // Add buffer rows above and below for smooth scrolling
        const startIndex = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.bufferSize);
        const endIndex = Math.min(
            this.allItems.length,
            startIndex + visibleRowCount + (this.bufferSize * 2)
        );

        this.visibleStartIndex = startIndex;
        this.visibleEndIndex = endIndex;

        // Calculate total height needed for all items
        const totalHeight = this.allItems.length * this.rowHeight;
        this.content.style.height = totalHeight + 'px';

        // Get only the items that should be visible
        const visibleItems = this.allItems.slice(startIndex, endIndex);

        // Render only the visible items
        this.renderItems(visibleItems, startIndex);
    },

    /**
     * Renders the visible items
     * @param {Array<{tag: string, count: number}>} items - Items to render
     * @param {number} startIndex - Starting index of the items
     */
    renderItems(items, startIndex) {
        // Create a document fragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();

        // Create a row for each visible item
        items.forEach((item, index) => {
            const actualIndex = startIndex + index;
            const row = this.createRow(item, actualIndex);
            fragment.appendChild(row);
        });

        // Clear existing content and add new rows
        this.content.innerHTML = '';
        this.content.appendChild(fragment);
    },

    /**
     * Creates a DOM element for a single tag row
     * @param {Object} item - Tag object with tag and count properties
     * @param {number} index - Index of the item
     * @returns {HTMLElement} - The row element
     */
    createRow(item, index) {
        // Create the row container
        const row = document.createElement('div');
        row.className = 'tag-row';
        
        // Set the position using transform (more efficient than top)
        const topPosition = index * this.rowHeight;
        row.style.position = 'absolute';
        row.style.top = topPosition + 'px';
        row.style.left = '0';
        row.style.right = '0';
        row.style.height = this.rowHeight + 'px';

        // Create tag name element
        const tagNameElement = document.createElement('div');
        tagNameElement.className = 'tag-name';
        tagNameElement.textContent = item.tag;

        // Create count element
        const countElement = document.createElement('div');
        countElement.className = 'tag-count';
        countElement.textContent = item.count.toLocaleString();

        // Add elements to row
        row.appendChild(tagNameElement);
        row.appendChild(countElement);

        return row;
    },

    /**
     * Scrolls to the top of the list
     */
    scrollToTop() {
        if (this.container) {
            this.container.scrollTop = 0;
            this.updateVisibleItems();
        }
    }
};

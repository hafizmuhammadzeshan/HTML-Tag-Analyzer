// Module to safely parse HTML and extract all tag names
// Uses DOMParser which is safe and doesn't execute scripts

const HtmlParser = {
    /**
     * Parses HTML string and extracts all tag names
     * @param {string} htmlContent - The HTML content as a string
     * @returns {Array<string>} - Array of all tag names found in the HTML
     */
    extractAllTags(htmlContent) {
        try {
            // Create a new DOMParser instance
            // This safely parses HTML without executing any scripts
            const parser = new DOMParser();
            
            // Parse the HTML string into a document object
            const document = parser.parseFromString(htmlContent, 'text/html');
            
            // Get all elements from the parsed document
            const allElements = document.querySelectorAll('*');
            
            // Extract tag names from all elements
            const tagNames = [];
            
            // Loop through all elements and get their tag names
            allElements.forEach(element => {
                const tagName = element.tagName.toLowerCase();
                tagNames.push(tagName);
            });

            return tagNames;

        } catch (error) {
            throw new Error(`Error parsing HTML: ${error.message}`);
        }
    }
};

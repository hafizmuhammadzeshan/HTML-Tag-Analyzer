// Module to filter tags based on search query

const SearchFilter = {
    /**
     * Filters tags based on search query
     * @param {Array<{tag: string, count: number}>} tags - Array of tag objects
     * @param {string} searchQuery - The search query string
     * @returns {Array<{tag: string, count: number}>} - Filtered array of tags
     */
    filterTags(tags, searchQuery) {
        // If no search query, return all tags
        if (!searchQuery || searchQuery.trim() === '') {
            return tags;
        }

        // Convert search query to lowercase for case-insensitive search
        const query = searchQuery.toLowerCase().trim();

        // Filter tags that match the search query
        const filteredTags = tags.filter(tagObject => {
            // Check if the tag name contains the search query
            return tagObject.tag.toLowerCase().includes(query);
        });

        return filteredTags;
    }
};

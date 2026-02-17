// Module to count tag occurrences and sort them by frequency

const TagAnalyzer = {
    /**
     * Counts occurrences of each tag and sorts by frequency
     * @param {Array<string>} tagNames - Array of tag names
     * @returns {Array<{tag: string, count: number}>} - Sorted array of tags with counts
     */
    analyzeTags(tagNames) {
        // Create an object to count tag occurrences
        const tagCounts = {};

        // Count how many times each tag appears
        tagNames.forEach(tagName => {
            if (tagCounts[tagName]) {
                tagCounts[tagName] += 1;
            } else {
                tagCounts[tagName] = 1;
            }
        });

        // Convert the counts object into an array of objects
        const tagArray = [];
        for (const tagName in tagCounts) {
            tagArray.push({
                tag: tagName,
                count: tagCounts[tagName]
            });
        }

        // Sort by count (highest first), then by tag name (alphabetically) for consistency
        tagArray.sort((a, b) => {
            // First sort by count (descending)
            if (b.count !== a.count) {
                return b.count - a.count;
            }
            // If counts are equal, sort by tag name (ascending)
            return a.tag.localeCompare(b.tag);
        });

        return tagArray;
    }
};

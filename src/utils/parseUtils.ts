/**
 * Rimuove i tag HTML da una stringa
 * @param html Stringa HTML da cui rimuovere i tag
 * @returns Testo pulito senza tag HTML
 */
export const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

/**
 * Utilità per il parsing e manipolazione di contenuti HTML
 */
export const parseUtils = {
    stripHtmlTags,
    
    /**
     * Tronca il testo a una lunghezza specifica
     * @param text Testo da troncare
     * @param maxLength Lunghezza massima
     * @param suffix Suffisso da aggiungere se il testo viene troncato
     * @returns Testo troncato
     */
    truncateText: (text: string, maxLength: number, suffix: string = '...'): string => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + suffix;
    },
    
    /**
     * Rimuove i tag HTML e tronca il testo
     * @param html Stringa HTML
     * @param maxLength Lunghezza massima
     * @param suffix Suffisso da aggiungere se il testo viene troncato
     * @returns Testo pulito e troncato
     */
    stripAndTruncate: (html: string, maxLength: number, suffix: string = '...'): string => {
        const cleanText = stripHtmlTags(html);
        return parseUtils.truncateText(cleanText, maxLength, suffix);
    }
};

/**
 * Extracts the brand/store name from a product link URL
 * Handles common e-commerce domains like farfetch.com, bergdorfgoodman.com, etc.
 * 
 * @param productLink - The full product URL
 * @returns The brand/store name (e.g., "farfetch", "bergdorf", "net-a-porter")
 *          Returns empty string if link is invalid or brand cannot be extracted
 * 
 * @example
 * extractBrandFromLink("https://www.farfetch.com/shopping/men/item.aspx") 
 * // Returns: "farfetch"
 * 
 * @example
 * extractBrandFromLink("https://www.bergdorfgoodman.com/p/product") 
 * // Returns: "bergdorf"
 */
export function extractBrandFromLink(productLink: string | undefined | null): string {
  if (!productLink || typeof productLink !== 'string') {
    return '';
  }

  try {
    // Handle both http:// and https:// URLs
    const url = new URL(productLink);
    const hostname = url.hostname.toLowerCase();
    
    // Remove www. prefix if present
    const hostnameWithoutWww = hostname.replace(/^www\./, '');
    
    // Extract domain name (first part before first dot)
    const domainParts = hostnameWithoutWww.split('.');
    
    if (domainParts.length === 0) {
      return '';
    }

    // Get the main domain name (usually the first part)
    let brandName = domainParts[0];

    // Special cases for common e-commerce sites
    const brandMappings: Record<string, string> = {
      'farfetch': 'farfetch',
      'bergdorfgoodman': 'bergdorf',
      'bergdorf': 'bergdorf',
      'netaporter': 'net-a-porter',
      'net-a-porter': 'net-a-porter',
      'ssense': 'ssense',
      'mytheresa': 'mytheresa',
      'matchesfashion': 'matches',
      'matches': 'matches',
      'modaoperandi': 'moda-operandi',
      'moda-operandi': 'moda-operandi',
      'luisaviaroma': 'luisaviaroma',
      'neimanmarcus': 'neiman-marcus',
      'neiman': 'neiman-marcus',
      'saksfifthavenue': 'saks',
      'saks': 'saks',
      'bloomingdales': 'bloomingdales',
      'nordstrom': 'nordstrom',
      'selfridges': 'selfridges',
    };

    // Check if we have a specific mapping
    if (brandMappings[brandName]) {
      return brandMappings[brandName];
    }

    // For subdomains, try to extract the main brand
    // e.g., "shop.bergdorfgoodman.com" -> "bergdorf"
    if (domainParts.length >= 2) {
      const secondPart = domainParts[1];
      if (brandMappings[secondPart]) {
        return brandMappings[secondPart];
      }
      // If second part contains the brand name
      if (secondPart.includes('bergdorf')) {
        return 'bergdorf';
      }
      if (secondPart.includes('farfetch')) {
        return 'farfetch';
      }
    }

    // Default: return the first domain part, capitalized
    return brandName;
  } catch (error) {
    // If URL parsing fails, try simple string extraction
    console.warn('Failed to parse URL:', productLink, error);
    
    // Fallback: extract domain from string
    const match = productLink.match(/https?:\/\/(?:www\.)?([^\/.]+)/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    
    return '';
  }
}


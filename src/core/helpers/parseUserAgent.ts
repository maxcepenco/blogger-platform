
export function parseUserAgent(userAgent: string): string {
    if (!userAgent) {
        return 'unknown browser';
    }

    let browser = 'unknown';
    let version = '';

    // Chrome (проверяем первым, т.к. содержит Safari в строке)
    if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
        const match = userAgent.match(/Chrome\/(\d+)/);
        browser = 'chrome';
        version = match ? match[1] : '';
    }
    // Edge (новый Edge на базе Chromium)
    else if (userAgent.includes('Edg/')) {
        const match = userAgent.match(/Edg\/(\d+)/);
        browser = 'edge';
        version = match ? match[1] : '';
    }
    // Firefox
    else if (userAgent.includes('Firefox/')) {
        const match = userAgent.match(/Firefox\/(\d+)/);
        browser = 'firefox';
        version = match ? match[1] : '';
    }
    // Safari (только настоящий Safari, не Chrome на iOS)
    else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) {
        const match = userAgent.match(/Version\/(\d+)/);
        browser = 'safari';
        version = match ? match[1] : '';
    }
    // Opera
    else if (userAgent.includes('OPR/') || userAgent.includes('Opera/')) {
        const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
        browser = 'opera';
        version = match ? match[1] : '';
    }
    // Mobile Safari (iOS)
    else if (userAgent.includes('Mobile') && userAgent.includes('Safari')) {
        const match = userAgent.match(/Version\/(\d+)/);
        browser = 'mobile safari';
        version = match ? match[1] : '';
    }

    return `${browser} ${version}`.trim();
}

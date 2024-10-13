async function checkCookieStatus() {

    const cookie = await getCookie();
    const body = {
        cookie_id: cookie
    }

    try {
        const response = await fetch('http://localhost:3000/api/music/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
         return response.json();
    } catch (error) {
        console.error('Error checking cookie status:', error);
        throw error;  // Return the error
    }
}

async function getCookie() {
    const name = "cookie_id=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    
    return "";
}

async function setCookie(cookieValue) {
    document.cookie = "cookie_id=" + cookieValue + ";max-age=600;path=/";
}

async function clearCookie() {
    document.cookie = "cookie_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

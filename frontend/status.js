async function checkCookieStatus() {
    return fetch('http://localhost:3000/api/music/status', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        return data; // ส่งข้อมูล status กลับไป
    })
    .catch(error => {
        console.error('Error checking cookie status:', error);
        throw error; // ส่ง error กลับไป
    });
}

// async function checkCookieStatus() {

//     return  {
//         status_code : 102,
//         name: "text"
//     }
    
// }

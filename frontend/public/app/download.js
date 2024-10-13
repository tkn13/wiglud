let downloadPath = "";

function generateAgain() {
    clearCookie();
    window.location.href = 'index';
}


async function downloadFile() {
    if (downloadPath) {
        const api_path = "http://localhost:3000/api/music/download/" + downloadPath;
        console.log(api_path);
        
        // Create a temporary link element to trigger the download

        // Set the cookie_id to expire in 10 minutes

        const link = document.createElement('a');
        link.href = api_path;
        link.setAttribute('download', ''); // This forces the browser to download the file
        
        // Append the link to the body (necessary for Firefox)
        document.body.appendChild(link);
        
        // Programmatically trigger the click event on the link
        link.click();
        
        // Remove the link after triggering the download
        document.body.removeChild(link);
        clearCookie();
    } else {
        console.error("Download path is not set!");
    }
}

//เพิ่มเช็คstatusก่อนจะเอาเข้าปุ่ม เพราะวา่ 102 url เป้ร null
async function getDownloadLink() {

        try{
            const data = await checkCookieStatus();

            if(data.status_code === 200){
                downloadPath = data.file_url
            }

            else if(data.status_code === 102){
              window.location.href = "loading"
            }
            else {
              window.location.href = "index"
            }


        } catch(e){
            console.error(e)
            window.location.href = "index"
        }
}

window.onload = function() {
    getDownloadLink();
}
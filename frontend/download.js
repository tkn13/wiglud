let downloadPath = "";

function generateAgain() {
    window.location.href = 'index1.html';
}

async function callMookFunction() {
    return {
        status_code: 200,
        something: "txt",
        file_url: "lksadjfadsjf"
    }

}

async function downloadFile(){
    const api_path = "localhost:3000/api/music/download/" + downloadPath
    console.log(api_path)
    await fetch(api_path, {
        method: 'GET',
    })
}


//เพิ่มเช็คstatusก่อนจะเอาเข้าปุ่ม เพราะวา่ 102 url เป้ร null
async function getDownloadLink() {

        try{
            const data = await callMookFunction(); //check status

            if(data.status_code === 200){
                downloadPath = data.file_url
            }

            else if(data.status_code === 102){
              window.location.href = "loading.html"
            }
            else {
              window.location.href = "index.html"
            }


        } catch(e){
            console.error(e)
            window.location.href = "index.html"
        }
}

window.onload = function() {
    getDownloadLink();
}
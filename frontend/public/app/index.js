// 1. ตรวจสอบสถานะของคุกกี้ก่อน
async function checkStatus() {
    console.log('Checking cookie status...');
    checkCookieStatus()
    .then(data => {
        const statusCode = data.status_code
        console.log(data);
        if (statusCode === 102) {
            // ถ้าคุกกี้อยู่ในสถานะการสร้างเพลง ให้ไปยังหน้าสถานะการสร้างเพลง (เช่น index2.html)
            window.location.href = 'loading';
        } else if (statusCode === 200) {
            // ถ้าเพลงพร้อมแล้ว ให้ไปหน้าดาวน์โหลด
            window.location.href = 'download';
        } 

        //This line is not needed it will cause the infinite loop

        // else {
        // // ถ้าไม่มีอะไรทำอยู่แล้ว ให้ปล่อยให้ผู้ใช้กรอกข้อมูลใน dropdown ได้
        //     window.location.href = 'index1.html';
        // }
    })
    .catch(error => {
        console.error('Error checking cookie status:', error);
    });
}

// 2. ส่งข้อมูล dropdown ไปยัง backend เพื่อเริ่มการสร้างเพลง
function generateMusic() {
    const typeOfMusic = document.getElementById('type-of-music').value;
    const instrument = document.getElementById('instrument').value;
    const length = document.getElementById('length').value;

    console.log(typeOfMusic, instrument, length);

    if (typeOfMusic && instrument && length) {
        // สร้าง object สำหรับข้อมูลที่จะส่งไปยัง backend
        const data = {
            genre: typeOfMusic,
            duration: length,
            instrument: instrument
        };

        // ส่งข้อมูลไป backend ด้วย fetch
        fetch('http://localhost:3000/api/music/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            const statusCode = data.status_code
            // const cookieValue = data.cookie_id; 
            if (statusCode === 102) {
                setCookie(data.request_id);
                // เปลี่ยนหน้าไปที่ index2.html ถ้าการสร้างเพลงสำเร็จ set cookie เข้ามา

                window.location.href = 'loading';
            } else {
                // แสดงข้อความแจ้งข้อผิดพลาด
                alert('Error generating music: ' + statusCode);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please select all fields.');
    }
}

// 3. เรียกฟังก์ชัน checkCookieStatus เมื่อหน้าโหลด
window.onload = function() {
    checkStatus();
};

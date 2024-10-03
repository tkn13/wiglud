// 1. ตรวจสอบสถานะของคุกกี้ก่อน
function checkCookieStatus() {
    fetch('/api/music/status', {
        method: 'GET',
        credentials: 'same-origin' // ส่ง cookie ไปพร้อมกับ request
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'generating') {
            // ถ้าคุกกี้อยู่ในสถานะการสร้างเพลง ให้ไปยังหน้าสถานะการสร้างเพลง (เช่น index2.html)
            window.location.href = 'index2.html';
        } else if (data.status === 'ready') {
            // ถ้าเพลงพร้อมแล้ว ให้ไปหน้าดาวน์โหลด
            window.location.href = 'download.html';
        }
        // ถ้าไม่มีอะไรทำอยู่แล้ว ให้ปล่อยให้ผู้ใช้กรอกข้อมูลใน dropdown ได้
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

    if (typeOfMusic && instrument && length) {
        // สร้าง object สำหรับข้อมูลที่จะส่งไปยัง backend
        const data = {
            typeOfMusic: typeOfMusic,
            instrument: instrument,
            length: length
        };

        // ส่งข้อมูลไป backend ด้วย fetch
        fetch('/api/music/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'same-origin' // ส่ง cookie ไปพร้อมกับ request
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // เปลี่ยนหน้าไปที่ index2.html ถ้าการสร้างเพลงสำเร็จ
                window.location.href = 'index2.html';
            } else {
                // แสดงข้อความแจ้งข้อผิดพลาด
                alert('Error generating music: ' + data.message);
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
    checkCookieStatus();
};

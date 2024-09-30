// ข้อความที่จะสุ่ม
const messages = [
    "Wiglud is writing a music for you...",
    "Ludwig van Beethoven....Wiglud",
    "ถ้าลุทวิก แวน บีโทเฟนต์ หัวล้าน เขาอาจจะวิกหลุด"
];

// ฟังก์ชันสุ่มข้อความ
function displayRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    document.getElementById('randomMessage').innerHTML = messages[randomIndex];
    //เวลาสุ่ม(เปลี่ยนทุก5วิ)
    setInterval(displayRandomMessage, 5000);
}

displayRandomMessage();

// setTimeout(() => {
//     window.location.href = 'index3.html';
// }, 15000);

async function fetchMusic() {
    try {
        const response = await fetch('/api/status', {
            method: 'GET',
            credentials: 'include'  // ส่งคุกกี้ไปด้วย (ต้องแน่ใจว่าคุกกี้ cookie_id ถูกแนบไป)
        });

        if (response.ok) {
            const data = await response.json();

            // ตรวจสอบว่าการสร้างเพลงเสร็จสมบูรณ์หรือไม่
            if (data.status_code === 200) {
                const fileUrl = data.file_url;  // ดึง URL ของไฟล์เพลงจาก response

                console.log("File URL:", fileUrl);

                // นำ URL ไปใช้ในปุ่มดาวน์โหลดหรือแสดงผลในหน้าเว็บ
                document.getElementById('downloadButton').setAttribute('href', fileUrl);
                window.location.href = 'index3.html';
            } else {
                console.error("Something went wrong:", data.message);
            }
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
    
    // เรียก fetchMusic ทุกๆ 5 นาที
    setInterval(fetchMusic, 300000);
    // เรียกใช้งานฟังก์ชัน fetchMusic เมื่อโหลดหน้าเว็บเสร็จ
    window.onload = fetchMusic;
}
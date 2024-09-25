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
        let response = await fetch('path'); // ใส่ URL ของไฟล์เพลง MP3 ที่ต้องการ

        // เช็คว่าการร้องขอสำเร็จหรือไม่
        if (response.ok) {
            // เมื่อได้รับไฟล์ mp3 ให้เปลี่ยนไปหน้า index3.html
            window.location.href = 'index3.html';
        } else {
            // ถ้ามีข้อผิดพลาดในการดึงไฟล์แสดงข้อความแจ้งเตือน
            document.getElementById('loadingMessage').innerHTML = 'Failed to load music. Please try again.';
        }
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น เช่น เครือข่ายมีปัญหา
        document.getElementById('loadingMessage').innerHTML = 'An error occurred: ' + error.message;
    }
}

// เรียกใช้งานฟังก์ชัน fetchMusic เมื่อโหลดหน้าเว็บเสร็จ
window.onload = fetchMusic;

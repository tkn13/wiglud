// ข้อความที่จะสุ่ม
const messages = [
    "Wiglud is writing a music for you...",
    "Ludwig van Beethoven....Wiglud",
    "Kid mai oak"
];

// ฟังก์ชันสุ่มข้อความ
function displayRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    document.getElementById('randomMessage').innerHTML = messages[randomIndex];
    //เวลาสุ่ม(เปลี่ยนทุก5วิ)
    setInterval(displayRandomMessage, 5000);
}

displayRandomMessage();



async function fetchMusic() {
    try {
        const data = await checkCookieStatus();

        // ตรวจสอบว่าการสร้างเพลงเสร็จสมบูรณ์หรือไม่
        if (data.status_code === 200) {
            window.location.href = 'download.html';
        }
        else if (data.status_code === 102) {
            console.log("idel");
        } else {
            console.log("Something went wrong:", data.message);
            window.location.href = 'index.html';
        }

    } catch (error) {
        console.error("Fetch error:", error);
        window.location.href = 'index.html';
    }

}

// เรียก fetchMusic ทุกๆ 3 วินาที
setInterval(fetchMusic, 3000);
// เรียกใช้งานฟังก์ชัน fetchMusic เมื่อโหลดหน้าเว็บเสร็จ
window.onload = fetchMusic;
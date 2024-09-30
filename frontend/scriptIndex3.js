function generateAgain() {
    window.location.href = 'index1.html';
}

// ฟังก์ชันปุ่มดาวน์โหลดไฟล์
window.onload = function() {
    const musicFileURL = localStorage.getItem('musicFileURL');
    if (musicFileURL) {
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.onclick = function() {
            // เปลี่ยน href ของปุ่มเป็น URL ของไฟล์เพลง
            window.location.href = musicFileURL;
        };
    } else {
        alert('No music file available. Please try again later.');
    }
};

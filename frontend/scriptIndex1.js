function generateMusic() {
    const typeOfMusic = document.getElementById('type-of-music').value;
    const instrument = document.getElementById('instrument').value;
    const length = document.getElementById('length').value;

    if (typeOfMusic && instrument && length) {
        // alert(`Generating ${length} of ${typeOfMusic} music with ${instrument}!`);
        window.location.href = 'index2.html';
    } else {
        alert('Please select all fields.');
    }
}

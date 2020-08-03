document.addEventListener("DOMContentLoaded", function() {
    let urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");
    const btnSave = document.getElementById("save");
    
    if (isFromSaved) {
        // Hide fab jika dimuat dari indexed db
        btnSave.style.display = 'none';
        // ambil data team yang sudah tersimpan di indexed db lalu tampilkan
        getSavedTeamById();
    } 
    else {
        getTeamById();
    }
    // var item = getTeamById();
    btnSave.onclick = () => {
        console.log("Tombol FAB di klik.");
        getTeamById().then((team) => {
            let save_idteam = team.id;
            cekIndexDB(save_idteam);
        });
    }
});
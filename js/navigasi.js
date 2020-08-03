document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();
  
    function loadNav() {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status != 200) return;
  
          // Muat daftar tautan menu
          const menuTautan = document.querySelectorAll(".topnav, .sidenav");
          menuTautan.forEach((elm) => {
            elm.innerHTML = xhttp.responseText;
          });
  
          // Daftarkan event listener untuk setiap tautan menu
          const menuEvent = document.querySelectorAll(".sidenav a, .topnav a");
          menuEvent.forEach((elm) => {
            elm.addEventListener("click", (event) => {
                // Tutup sidenav
                const sidenav = document.querySelector(".sidenav");
                M.Sidenav.getInstance(sidenav).close();
  
                // Muat konten halaman yang dipanggil
                page = event.target.getAttribute("href").substr(1);
                loadPage(page);
            });
          });
        }
      };
      xhttp.open("GET", "navigasi.html", true);
      xhttp.send();
    }
  
    // Load page content
    let page = window.location.hash.substr(1);
    if (page === "") {
        page = "klub";
    }
    loadPage(page);
  
    function loadPage(page) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          const content = document.querySelector("#body-content");
          if (page === "klub") {
            getKlubLiga();
          } else if (page ==="klasemen") {
            getKlasemen();
          } else if (page === "saved") {
            getSavedTeam();
          }

          if (this.status === 200) {
            content.innerHTML = xhttp.responseText;
          } else if (this.status === 404) {
            content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
          } else {
            content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
          }
        }
      };
      xhttp.open("GET", "pages/" + page + ".html", true);
      xhttp.send();
    }
  
  });
  
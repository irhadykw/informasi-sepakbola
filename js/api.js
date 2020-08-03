const api_token = 'd6296b5081364b8eb8fe857800d77b99';
const base_url = "https://api.football-data.org/v2/";
const kode_liga = '2014';
let klub_liga = `${base_url}competitions/${kode_liga}/standings`;
let detail_team = `${base_url}teams/`;

// authentication API Token
const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': api_token
        }
    });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}


// BLOK KODE UNTUK MELAKUKAN REQUEST DATA JSON  //

// Fungsi menampilkan daftar nama-nama klub pada Liga
function getKlubLiga() {
  if ("caches" in window) {
    caches.match(klub_liga).then((response) => {
      if (response) {
        response.json().then((data) => {
          // memanggil fungsi daftar klub
          daftarKlub(data);
        });
      }
    });
  }
  fetchAPI(klub_liga)
    .then(status)
    .then(json)
    .then( (data) => {
      // memanggil fungsi daftar klub
      daftarKlub(data);
    })
    .catch(error);
}

// fungsi untuk menampilkan detail dari klub yang terpilih
function getTeamById() {
  return new Promise( (resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    
    if ("caches" in window) {
      caches.match(detail_team + idParam).then((response)=> {
        if (response) {
          response.json().then( (data) => {
            detailKlub(data);
            daftarPemain(data);
            resolve(data);
          });
        }
      });
    }

    fetchAPI(detail_team + idParam)
      .then(status)
      .then(json)
      .then((data)=> {
        detailKlub(data);
        daftarPemain(data);
        resolve(data);
    });
  });
}


// Fungsi menampilkan daftar klasemen
function getKlasemen() {
  if ("caches" in window) {
    caches.match(klub_liga).then( (response) => {
      if (response) {
        response.json().then( (data) => {
          // memanggil fungsi daftar klasemen
          daftarKlasemen(data);
        });
      }
    });
  }

  fetchAPI(klub_liga)
    .then(status)
    .then(json)
    .then( (data) => {
      // memanggil fungsi daftar klasemen
      daftarKlasemen(data);
    })
    .catch(error);  
}

function getSavedTeam() {
  getAll().then((data) => {
    savedTeam(data);       
  });
}

function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");
  getById(idParam).then((data) => {
    detailKlub(data);
    daftarPemain(data);
  });
}

// Menghapus team yang ada di indexed DB
const deleteTeam = (id, name) => {
  let confirmDelete = confirm;
  if (confirmDelete) {
      //Delete Team from db
      deleteById(id).then( (team) => { });
      getSavedTeam();
      M.toast({
          html: `Team ${name} berhasil dihapus`,
      })
  }
}

// BLOK FUNGSI MENAMPILKAN DATA API DI BODY HTML //
const daftarKlub = ((data) => {
  data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
  const klubLiga = data.standings[0].table;
  let klubHTML = "";
  klubLiga.forEach((klub) => {
    klubHTML += `
      <div class="mycard">
        <p>${klub.team.name}</p>
        <div class="my-image">
          <a href="./detail-klub.html?id=${klub.team.id}">
            <img src="${klub.team.crestUrl}" alt="Logo Klub ${klub.team.name}"/>
          </a>
        </div>
      </div>
        `;
  });
  document.getElementById("klub").innerHTML = klubHTML;
});

// fungsi menampilkan detail klub 
const detailKlub = (data) => {
  data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
  let detailKlubHTML = `
    <h5 class="judul">Detail Klub</h5>
    <div class="card-team">
      <div class="logo-team"><img src="${data.crestUrl}" alt="Logo Team ${data.name}"/></div>
      <div class="desc-team">
        <p>Nama Club : <b>${data.name}</b></p>
        <p>Tahun Berdiri : <b>${data.founded}</b></p>
        <p>Nama Stadiun : <b>${data.venue}</b></p>
        <p>Website : <a href="${data.website}">${data.website}</a></p>
      </div>
    </div>
  `;
  document.getElementById("body-content").innerHTML = detailKlubHTML;
}

// fungsi menampilkan daftar pemain
const daftarPemain = (data) => {
  data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
  let pemainHTML = ''; 
    data.squad.forEach((pemain) => {
      pemainHTML += `
        <tr class="tr-body">
          <td>${pemain.name}</td>
          <td>${pemain.position}</td>
          <td>${pemain.role}</td>
          <td class="col-hide">${pemain.shirtNumber}</td>
          <td class="col-hide">${pemain.nationality}</td>
        </tr>  
      `;
  });
  document.getElementById("list-pemain").innerHTML = pemainHTML;
}

// fungsi daftar klasemen
const daftarKlasemen = (data) => {
  data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
  let klasemenHTML = "";
  let klasemenLiga = data.standings[0].table;
  klasemenLiga.forEach((klasemen) => {
    klasemenHTML += `
      <tr class="tr-body">
        <td class="center-align">${klasemen.position}</td>    
        <td class="center-align col-hide logo-klasemen"><img src="${klasemen.team.crestUrl}" /></td>
        <td class="left-align">${klasemen.team.name}</td>
        <td class="center-align">${klasemen.playedGames}</td>
        <td class="center-align col-hide">${klasemen.won}</td>
        <td class="center-align col-hide">${klasemen.draw}</td>
        <td class="center-align col-hide">${klasemen.lost}</td>
        <td class="center-align">${klasemen.points}</td>
      </tr>
    `;
  });
  document.getElementById("klasemen").innerHTML = klasemenHTML;
} 

const savedTeam = (data) => {
  data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
  let savedTeamHTML = '';
  data.forEach((team) => {
    savedTeamHTML += `
        <div class="mycard">
          <p>${team.name}</p>
          <div class="my-image">
            <a href="./detail-klub.html?id=${team.id}&saved=true"">
              <img src="${team.crestUrl}" alt="Logo Klub ${team.name}"/>
            </a>
          </div>
          <div class="delete-team">
            <a class="btn-floating btn-small red btn waves-effect waves-green" onclick="deleteTeam(${team.id},'${team.name}')">
              <i class="large material-icons">delete</i>
            </a>
          </div>
        </div>
        `;
  });
  document.getElementById("team-saved").innerHTML = savedTeamHTML;
}
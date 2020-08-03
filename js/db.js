const namaObjStore = "teamliga";

const dbPromised = idb.open("info-bola", 1, (upgradeDb) => {
    let teamLigaObjectStore = upgradeDb.createObjectStore(namaObjStore, {
      keyPath: "id"
    });
    teamLigaObjectStore.createIndex("name", "name", { unique: false });
});

function saveForLater(team) {
dbPromised
    .then((db) => {
      let tx = db.transaction(namaObjStore, "readwrite");
      let store = tx.objectStore(namaObjStore);
      console.log(team);
      store.put(team);
      return tx.complete;
    })
    .then(() => {
      console.log("Data tim berhasil di simpan.");
    });
}

function getAll() {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction(namaObjStore, "readonly");
        let store = tx.objectStore(namaObjStore);
        return store.getAll();
      })
      .then((team) => {
        resolve(team);
      });
  });
}

function getById(id) {
  let get_id = parseInt(id);
  return new Promise((resolve, reject) => {
    dbPromised.then((db) => {
        let tx = db.transaction(namaObjStore, "readonly");
        let store = tx.objectStore(namaObjStore);
        return store.get(get_id);
      })
      .then((team) => {
        resolve(team);
      });
  });
}

function deleteById(id) {
  let get_id = parseInt(id);
  return new Promise((resolve, reject) => {
    dbPromised
    .then((db) => {
      let tx = db.transaction(namaObjStore, 'readwrite');
      let store = tx.objectStore(namaObjStore);
      store.delete(get_id);
      return tx.complete;
    }).then( () => {
      console.log("Berhasil menghapus data");
    });
  });
}

function cekIndexDB(save_idteam) {
  getAll()
  .then((teams) => {
    const idTeams = Object.values(teams).map((data) =>{
      let saved_idteams = data.id;
      return saved_idteams;
    });

    // Mengecek apakah id team yang akan disimpan sudah ada dalam indexeddb
    let cekDataTeam = idTeams.includes(save_idteam);
    let item = getTeamById();
    if(!cekDataTeam) {
      item.then((team) => {
        saveForLater(team);
        M.toast({
          html: `Team ${team.name} berhasil disimpan`,
        });
      });
    } else {
      item.then((team) => {
        M.toast({
          html: `Team ${team.name} sudah ada dalam database`,
        });
      });
    }
  })
}
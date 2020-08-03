// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() =>{
      console.log('Pendaftaran ServiceWorker berhasil');
    }, () => {
      console.log('Pendaftaran ServiceWorker gagal');
    });
    navigator.serviceWorker.ready.then(() => {
      console.log('ServiceWorker sudah siap bekerja.');
      requestPermission();
    });
  
  } else {
    console.log("ServiceWorker belum didukung browser ini.")
  }
const jumlahAntrian = document.getElementById("jumlah-antrian")
const antrianSekarang = document.getElementById("antrian-sekarang")
const antrianSelanjutnya = document.getElementById("antrian-selanjutnya")
const sisaAntrian = document.getElementById("sisa-antrian")

const tombolTintung = document.getElementById("test")
const tintung = document.getElementById("tingtung")
const tunting = document.getElementById("tungting")
const listAntrian = document.getElementById("listAntrian")
const listAntrianSelesai = document.getElementById("antrianSelesai")
const resetBtn = document.getElementById("reset-antrian")
const inputAntrian = document.getElementById("input-antrian");
const tombolInputAntrian = document.getElementById("tombol-input-antrian");

const numInput = document.getElementById("input-antrian")
const numInputBtn = document.getElementById("tombol-input-antrian")


function insertData(){
    console.log(numInput.value)

       let noAntrian = ""
       switch(numInput.value.length){
           case 1 :{
              noAntrian = "D00"
              break
           }
           case 2 :{
              noAntrian = "D0"
              break
           }
           case 3 :{
              noAntrian = "D"
              break
           }
    }
    firebase.database().ref("antrian/yankomas").child(numInput.value).set({
            'timestamp' : Date.now(),
            'noAntrian' : noAntrian+numInput.value ,
            'status' : 0,
            'soundState' : 0,
        })
    
}
function getData(){
    firebase.database().ref("antrian").child("yankomas").on("value", (snap) => {
        jumlahAntrian.innerHTML = snap.numChildren()
        antrianSekarang.innerHTML = "-"  // Ubah tampilan awal menjadi "-"
        listAntrian.innerHTML = ""
        listAntrianSelesai.innerHTML = ""
        sisaAntrian.innerHTML = 0
        var condition = 0
        var test = 0
        let hitungNilaiSoundState = 0
        let hitungNilai0 = 0
        let hitungNIlai1 = 0
        let hitungNilai2 = 0

        for(const key in snap.val()){

            switch(snap.val()[key].status){
                case 0 :{
                   hitungNilai0++
                   break
                }
                case 1 :{
                 hitungNIlai1++
                 break
                }
                case 2 :{
                   hitungNilai2++
                   break
                }
            }

            if(snap.val()[key].soundState == 1){
                hitungNilaiSoundState++
            }
        }

        if(hitungNilai0 == 0 && hitungNIlai1 == 0 ){
            antrianSelanjutnya.innerHTML="-"
            listAntrian.innerHTML = (`
                <tr>
                    <th colspan="3" style="text-align:center">Semua antrian telah dipanggil/masih kosong!!</th>
                </tr>`)
        }
        if(hitungNilai0 == 0 ){
            antrianSelanjutnya.innerHTML ="-"

        }
        
        snap.forEach((data) => {
            switch(data.val().status){
                case 0: {
                    listAntrian.innerHTML += (`
                        <tr> 
                        <th> ${data.val().noAntrian}</th>
                        <th id ="callBtn${condition}" onclick="panggilAntrian('${data.val().noAntrian}', '${data.key}','${hitungNilaiSoundState}')"> 
                            <button class="btn btn-success btn-sm rounded-circle"><i class="bi-mic-fill"></i></button>                 
                        </th>
                        <th>
                            <button class="btn btn-danger btn-sm rounded-circle" onclick="selesaiAntrian('${data.key}','${data.val().noAntrian}')">Selesai</button>
                        </th>
                        </tr>
                    `)
                    condition += 1
                    if(condition == 1){
                        antrianSelanjutnya.innerHTML = data.val().noAntrian
                    }
                    sisaAntrian.innerHTML = parseInt(sisaAntrian.innerHTML) + 1
                    break
                }
                case 1 : {
                    listAntrian.innerHTML += (`
                        <tr>
                        <th> ${data.val().noAntrian}</th>  
                        <th id ="callBtn${condition}" onclick="panggilAntrian( '${data.val().noAntrian}', '${data.key}','${hitungNilaiSoundState}')"> 
                            <button class="btn btn-secondary btn-sm rounded-circle"><i class="bi-mic-fill"></i></button>                      
                        </th>
                        <th>
                            <button class="btn btn-danger btn-sm rounded-circle" onclick="selesaiAntrian('${data.key}','${data.val().noAntrian}')">Selesai</button>
                        </th>
                        </tr>`)
                    break
                }
                case 2 : {
                    listAntrianSelesai.innerHTML += (`
                        <tr>
                        <th> ${data.val().noAntrian}</th>  
                        <th id ="callBtn${condition}" onclick="panggilAntrian( '${data.val().noAntrian}', '${data.key}','${hitungNilaiSoundState}')"> 
                            <button class="btn btn-success btn-sm rounded-circle"><i class="bi-mic-fill"></i></button>                      
                        </th>
                        <th style="color:#00FF00;">Selesai!</th>
                        </tr>`)
                    // hitungNilai2++;
                    break
                }
            }
        })

        if (hitungNilai2 == 0) {
            listAntrianSelesai.innerHTML = (`
                <tr>
                    <th colspan="3" style="text-align:center">Belum ada antrian selesai</th>
                </tr>
            `)
        }
    })
}


function selesaiAntrian(key, noAntrian){
    firebase.database().ref("antrian/yankomas").child(key).set({
        timestamp: Date.now(),
        noAntrian: noAntrian,
        status: 2,
        soundState: 0
    })
}

function setAntrianSekarang(){
    firebase.database().ref("antrian/yankomas").orderByChild("timestamp").on("value", (snap) => {
        let adaAntrianSekarang = false;
        snap.forEach((data) => {
            if(data.val().status == 1){
                antrianSekarang.innerHTML = data.val().noAntrian
                adaAntrianSekarang = true;
            }
        })
        if (!adaAntrianSekarang) {
            antrianSekarang.innerHTML = "-";
        }
    })
}

function resetData(){
    firebase.database().ref("antrian/yankomas").remove()
}

function panggilAntrian(noAntrian, antrianKey, hitungNilaiSoundState){
    if(hitungNilaiSoundState < 1){
        firebase.database().ref("antrian/yankomas").child(antrianKey).set({
            timestamp: Date.now(),
            noAntrian: noAntrian,
            status: 1,
            soundState: 1,
        })
    }
    
    console.log(hitungNilaiSoundState)
}

// Ketika tombol reset diklik
resetBtn.addEventListener('click', () => {
    $('#confirmResetModal').modal('show');
});
  
// Ketika tombol konfirmasi reset ditekan
document.getElementById('confirmResetBtn').addEventListener('click', function() {
    resetData();
    $('#confirmResetModal').modal('hide');
    window.location.reload();
});

// Ketika tombol konfirmasi reset ditekan
document.getElementById('confirmResetBtn').addEventListener('click', function() {
    resetData();
    $('#confirmResetModal').modal('hide');
    window.location.reload();
});

document.getElementById("tombol-input-antrian").addEventListener("click", function() {
    const inputAntrian = document.getElementById("input-antrian");
    const nomorAntrian = inputAntrian.value.trim();
    if (nomorAntrian === "") {
        $('#inputErrorModal').modal('show');
        return;
    }
    $('#confirmInputModal').modal('show');
});

document.getElementById('confirmInputBtn').addEventListener('click', function() {
    $('#confirmInputModal').modal('hide');
    insertData();
    // window.location.reload();
});

document.getElementById("input-antrian").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Mencegah aksi default form submit
        document.getElementById("tombol-input-antrian").click();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    getData();
    setAntrianSekarang();

});


document.addEventListener("DOMContentLoaded", () => {
    getData();
    setAntrianSekarang();
});

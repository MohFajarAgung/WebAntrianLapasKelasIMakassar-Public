const antrianDis = document.getElementById("antrian-disabilitas");
const antrianKun = document.getElementById("antrian-kunjungan");
const antrianTitipanBrg = document.getElementById("antrian-titipan");
const yankomas = document.getElementById("antrian-yankomas");

const tingtung = document.getElementById("tingtung");
const tungting = document.getElementById("tungting");

function getData() {
    const services = [
        { ref: "layananDisabilitas", element: antrianDis },
        { ref: "layananKunjungan", element: antrianKun },
        { ref: "layananTitipanBrg", element: antrianTitipanBrg },
        { ref: "yankomas", element: yankomas }
    ];
    services.forEach(service => {
        firebase.database().ref("antrian").child(service.ref).orderByChild("timestamp").on("value", (snap) => {
            
            snap.forEach((data) => {
                if (data.val().status == 1) {
                    service.element.innerHTML = data.val().noAntrian;
                }
                if (data.val().soundState == 1) {
                    playCall(data.val().noAntrian, () => {
                        console.log("berhasil");
                        tungting.play();
                        firebase.database().ref(`antrian/${service.ref}`).child(data.key).set({
                            timestamp: Date.now(),
                            noAntrian: data.val().noAntrian,
                            status: 1,
                            soundState: 0,
                        });
                        tungting.addEventListener("ended", ()=>{
                               service.element.parentElement.style.background = "white"
                    service.element.parentElement.style.color = "black"
                        })
                    });
                    service.element.parentElement.style.background = "#00aa9d"
                    service.element.parentElement.style.color = "white"
                    // if(service.element.innerHTML == data.val().noAntrian){
                    // }
                }
      
       
            });

    
           
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getData();
});

const audioKata = [
    new Audio('../audio/kata/Menuju.wav'),
    new Audio('../audio/kata/Nomor_antrian.wav'),
    new Audio('../audio/kata/di_loket.wav')
];

const audioAngka = Array.from({ length: 12 }, (_, i) => new Audio(`../audio/angka/${i}.wav`)).concat([
    new Audio('../audio/angka/belas.wav'),
    new Audio('../audio/angka/puluh.wav'),
    new Audio('../audio/angka/ratus.wav'),
    new Audio('../audio/angka/seratus.wav')
]);

const audioHuruf = ['A', 'B', 'C', 'D'].map(letter => new Audio(`../audio/huruf/${letter}.wav`));

function playCall(noAntrian, callback) {
    const queue = [];

    tingtung.play();
    tingtung.addEventListener("ended", function () {
        queue.push(audioKata[1]);

        const huruf = noAntrian.charAt(0).toUpperCase();
        const hurufIndex = ['A', 'B', 'C', 'D'].indexOf(huruf);
        if (hurufIndex >= 0) queue.push(audioHuruf[hurufIndex]);

        const angka = noAntrian.substring(1);
        console.log(angka)

        // Menyusun angka ratusan, puluhan dan satuan
        for (let i = 0; i < angka.length; i++) {
            // untuk angka 10 dan 11
            // if(angka[i] == 0){
            //     queue.push(audioAngka[parseInt(angka.charAt(i))])
            //     if(angka[1]==1 ){
            //         // untuk angka 11
            //         if(angka[2]==1){
            //             queue.push(audioAngka[11])
            //              break
            //         }
            //         else{
            //             // untuk angka 10
            //             if(angka[2]==0){
            //                 queue.push(audioAngka[10])
            //                 break
            //             }else{
            //                 // untuk angka 12 sampai 19
            //                 queue.push(audioAngka[parseInt(angka.charAt(2))])
            //                 queue.push(audioAngka[12])
            //                 break
            //             }
            //         }

            //     }else{
            //         // untuk angka puluhan 20 - 90
            //         if(angka[1]!= 0 && angka[1]!=1){   
            //             queue.push(audioAngka[parseInt(angka.charAt(i+1))])
            //             queue.push(audioAngka[13]) 
            //             if(angka[2]==0){
            //                 break
            //             }else{
            //                 // untuk angka puluhan 21 sampai 99
            //                 queue.push(audioAngka[parseInt(angka.charAt(2))])
            //                 break
            //             }
            //         }
            //     }
            // }else{
            //     // untuk angka 100
            //     if(angka == 100){
            //         queue.push(audioAngka[15])
            //         break
            //     }
                
            //     if(angka[0] != 0 ){
            //         // angka untuk 1 - 9 
            //         if(angka[0]==1){  
            //             queue.push(audioAngka[15])
            //             }else{
            //                 queue.push(audioAngka[parseInt(angka.charAt(i))])
            //                 // untuk ratusan
            //                 queue.push(audioAngka[14])
            //             }
            //         if(angka[1]==0 && angka[2] == 0){
            //             break
            //         }
            //         if(angka[1]==1){
            //             if(angka[2]==1){
            //                 // UNTUK 111
            //                 queue.push(audioAngka[11])
            //             }else if(angka[2]==0){
            //                 // UNTUK 110
            //                 queue.push(audioAngka[10])

            //             }else{
            //                 queue.push(audioAngka[parseInt(angka.charAt(2))])
            //                 queue.push(audioAngka[12])
            //                 break
            //             }
            //         }
            //         else{
            //             // untuk ratusan, satuan
            //             if(angka[1]==0){
            //               queue.push(audioAngka[parseInt(angka.charAt(2))])
            //               break
            //             }
            //             queue.push(audioAngka[parseInt(angka.charAt(1))])
            //             queue.push(audioAngka[13])
            //             if(angka[2]!=0){
            //                 // untuk ratusan, puluhan, dan satuan
            //               queue.push(audioAngka[parseInt(angka.charAt(2))])
            //             }{
            //                 break
            //             }
            //         }
            //     }
            //     break
            // }
            queue.push(audioAngka[parseInt(angka.charAt(i))])
        }

        queue.push(audioKata[0]);
        queue.push(audioKata[2]);
        

        function playQueue(index) {
            if (index < queue.length) {
                queue[index].play();
                queue[index].onended = () => playQueue(index + 1);
            } else {
                callback();
            }
        }

        playQueue(0);
    });
}

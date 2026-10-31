export interface WardChoice {text:string;points:number;minutes:number;feedback:string}
export interface WardStage {title:string;prompt:string;note:string;choices:WardChoice[]}
export const wardStages:WardStage[]=[
 {title:'Kenali kegawatan',prompt:'Pasien tampak gelisah, ekstremitas dingin, tekanan darah 86/58 mmHg. Apa prioritas Anda?',note:'Perawat: “Dok, pasien makin sesak dalam 30 menit terakhir.”',choices:[
 {text:'Lengkapi administrasi dahulu, lalu evaluasi ulang',points:0,minutes:5,feedback:'Administrasi tidak mengatasi gangguan perfusi. Hipotensi dengan tanda perfusi buruk membutuhkan respons segera.'},
 {text:'Nilai ABC, pasang pemantauan, dan panggil tim senior segera',points:20,minutes:1,feedback:'Penilaian awal, pemantauan, dan eskalasi dilakukan bersama untuk menghadapi ketidakstabilan.'},
 {text:'Kirim ke ruang tunggu sambil menunggu hasil darah',points:0,minutes:6,feedback:'Pasien tidak stabil memerlukan penilaian dan pemantauan segera. Menunggu hasil tanpa stabilisasi menunda respons.'}]},
 {title:'Pilih pemeriksaan',prompt:'Tim senior menuju bedside. JVP meningkat dan suara jantung terdengar pelan. Pemeriksaan apa yang paling membantu saat ini?',note:'Temuan baru: vena leher tampak meningkat. Tidak ada trauma yang dilaporkan.',choices:[
 {text:'Ekokardiografi bedside segera, bersamaan dengan penilaian dan stabilisasi',points:20,minutes:2,feedback:'Echo bedside membantu mengevaluasi efusi dan dampak hemodinamik tanpa memindahkan pasien yang tidak stabil.'},
 {text:'Jadwalkan CT rawat jalan untuk besok',points:0,minutes:6,feedback:'Jadwal rawat jalan tidak sesuai dengan ketidakstabilan saat ini. Pemeriksaan harus mendukung respons segera.'},
 {text:'Tunggu seluruh panel laboratorium sebelum menilai jantung',points:0,minutes:5,feedback:'Hasil laboratorium dapat membantu, tetapi tidak boleh menjadi prasyarat penilaian bedside pada pasien tidak stabil.'}]},
 {title:'Satukan petunjuk',prompt:'Echo menunjukkan efusi perikardium dengan kolaps diastolik ventrikel kanan. Penjelasan yang paling sesuai?',note:'Hasil echo tersedia di Rekam Medis. Hubungkan gambaran dengan hipotensi dan temuan pemeriksaan.',choices:[
 {text:'Efusi insidental tanpa dampak sirkulasi',points:0,minutes:4,feedback:'Pada skenario ini, hipotensi dan kolaps diastolik menunjukkan dampak hemodinamik; efusi tidak boleh dianggap insidental.'},
 {text:'Gagal jantung stabil yang dapat dievaluasi elektif',points:0,minutes:4,feedback:'Tanda perfusi buruk dan temuan echo tidak mendukung klasifikasi stabil atau evaluasi elektif.'},
 {text:'Tamponade jantung dengan gangguan pengisian dan perfusi',points:20,minutes:1,feedback:'Kombinasi kondisi klinis dan temuan echo mendukung tamponade. Ukuran efusi saja tidak menentukan kegawatan.'}]},
 {title:'Tentukan prioritas',prompt:'Tim mengonfirmasi tamponade dengan ketidakstabilan. Keputusan berikutnya?',note:'Ini latihan prioritas dan eskalasi, bukan latihan teknik invasif.',choices:[
 {text:'Menunggu echo serial besok tanpa eskalasi',points:0,minutes:6,feedback:'Ketidakstabilan pada tamponade membutuhkan penanganan segera; observasi rutin saja menunda terapi definitif.'},
 {text:'Siapkan drainase segera oleh tim berpengalaman sesuai etiologi dan fasilitas',points:20,minutes:2,feedback:'Drainase merupakan terapi definitif. Tim berpengalaman memilih akses perkutan atau bedah sesuai konteks.'},
 {text:'Berikan diuretik rutin sebagai terapi definitif',points:0,minutes:5,feedback:'Diuretik bukan terapi definitif tamponade dan dapat mengurangi preload. Dibutuhkan eskalasi untuk drainase.'}]},
 {title:'Tutup lingkaran',prompt:'Setelah drainase oleh tim, tekanan darah skenario menjadi 108/70 mmHg. Apa tindak lanjut Anda?',note:'Perubahan angka adalah alur ilustratif tetap, bukan prediksi respons fisiologis.',choices:[
 {text:'Nilai ulang perfusi, lanjutkan monitor, dan evaluasi etiologi serta re-akumulasi',points:20,minutes:1,feedback:'Perbaikan awal tetap membutuhkan pemantauan, evaluasi penyebab, dan pengawasan komplikasi atau re-akumulasi.'},
 {text:'Hentikan monitor karena satu kali tekanan darah membaik',points:0,minutes:4,feedback:'Satu kali pengukuran yang membaik tidak cukup untuk menghentikan pemantauan.'},
 {text:'Pulangkan segera tanpa penilaian ulang',points:0,minutes:5,feedback:'Setelah kegawatan dan intervensi, dibutuhkan pemantauan serta evaluasi etiologi sebelum keputusan lanjutan.'}]}
];
export interface WardSession {mode:'learn'|'shift';index:number;answers:number[];submitted:boolean;done:boolean}
export const newWardSession=(mode:WardSession['mode']):WardSession=>({mode,index:0,answers:[],submitted:false,done:false});
export function wardTotals(s:WardSession){return s.answers.reduce((total,a,i)=>{const choice=wardStages[i]?.choices[a];return {points:total.points+(choice?.points||0),minutes:total.minutes+(choice?.minutes||0)}},{points:0,minutes:0})}
export function commitWard(s:WardSession,answer:number):WardSession {if(s.done||s.submitted||!wardStages[s.index]?.choices[answer])return s;const answers=[...s.answers];answers[s.index]=answer;return {...s,answers,submitted:true}}
export function nextWard(s:WardSession):WardSession {if(!s.submitted||s.done)return s;return s.index===wardStages.length-1?{...s,done:true}:{...s,index:s.index+1,submitted:false}}

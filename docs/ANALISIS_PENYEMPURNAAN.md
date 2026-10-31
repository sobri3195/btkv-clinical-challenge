# Analisis dan penyempurnaan BTKV Clinical Challenge

Tanggal audit: 30 Oktober 2026. Sumber: pengujian antarmuka situs Vercel dan pemeriksaan kode sumber repositori sobri3195/btkv-clinical-challenge. Temuan berlaku terhadap versi main yang diperoleh saat audit, bukan semua versi terdahulu.

## Kesimpulan utama

Aplikasi telah memiliki fondasi yang berguna: katalog 18 kasus, lima tahap pertanyaan, halaman perencanaan operasi, modul hemodinamika, pencarian, favorit, tema, dan penyimpanan lokal. Kesenjangan terbesarnya terletak pada kejujuran penilaian, spesifisitas klinis, dan pengalaman mengambil keputusan. Pengembangan visual saja tidak menyelesaikan masalah tersebut.

Arah produk yang disarankan adalah simulasi jaga BTKV dengan pasien fiktif, informasi yang tersedia bertahap, keputusan yang terdokumentasi, pembahasan yang dapat ditelusuri, dan penilaian yang berasal dari tindakan pemain. Implementasi awal dalam perubahan ini mencakup satu skenario lengkap, bukan klaim bahwa seluruh bank kasus sudah menjadi simulator tervalidasi.

## Batas peninjauan video referensi

Tautan pendek TikTok berhasil dibuka dan mengarah ke video akun @ffhgyu5. Pada tampilan yang tersedia terlihat permainan bertema rumah sakit, label RS Tipe D, tombol Main, dan Koleksi Kasus. Pemutaran menyeluruh terhalang antarmuka masuk/usia TikTok. Dengan demikian, detail mekanisme, alur pasien, scoring, dan seluruh animasi video belum terverifikasi. Fitur baru merupakan interpretasi kebutuhan simulasi rumah sakit berdasarkan bagian yang terlihat, bukan salinan mekanisme video yang diklaim identik.

## Temuan audit

| Area | Bukti pada kode awal | Dampak | Perbaikan pada versi ini |
|---|---|---|---|
| Hasil akhir | CaseResult menetapkan score=80 | Pemain dengan jawaban berbeda mendapatkan hasil sama | Skor dihitung dari jawaban tersimpan, termasuk hasil 0 dan 100 |
| Rincian kompetensi | Diagnosis 90, interpretation 80, dan angka domain lainnya ditulis langsung | Memberi kesan kemampuan terukur tanpa bukti | Rincian menjadi benar/perlu tinjau per tahap pertanyaan |
| Posisi jawaban | Semua pertanyaan memakai correct:0 | Pemain dapat memilih A tanpa memahami kasus | Urutan pilihan diputar secara deterministik per pertanyaan |
| Progres global | Sidebar/header berisi level 12, 2.480 XP, streak 7, rank 12 | Bertentangan dengan dashboard yang masih kosong | XP, level, streak berasal dari aktivitas kasus yang selesai; rank diganti level pribadi |
| Sinkronisasi | Setiap pemanggilan hook membuat state lokal sendiri | Favorit dan progres antar komponen bisa tidak konsisten | Store bersama berbasis useSyncExternalStore dan notifikasi perubahan |
| Pemulihan sesi | Pertanyaan, jawaban, dan status submit berada dalam useState | Reload mengulang soal; sesi tersimpan tidak dipakai untuk melanjutkan | Simpan indeks, pilihan, submit, hint, dan status selesai pada setiap perubahan |
| Akses hasil | Membuka halaman result menandai selesai otomatis | Kasus dapat dicatat tanpa menyelesaikan soal | Guard kelengkapan sesi dan pencatatan lewat alur penyelesaian eksplisit |
| Perencanaan operasi | Daftar jawaban generik sama pada semua kasus | Tidak sesuai untuk mengukur pengetahuan operasi kasus berbeda | Diberi status refleksi formatif tanpa nilai; strategi kasus ditampilkan sebagai konteks |
| Kesiapan domain | Nilai rata-rata dikurangi indeks domain | Domain yang belum dilatih tampak mempunyai nilai | Hitung hanya dari kasus selesai pada domain tersebut; lainnya Not assessed |
| Navigasi | Leaderboard membuka favorites; Imaging membuka pencarian | Label menjanjikan fungsi yang berbeda | Label menjadi Favorites dan Search |
| Melanjutkan belajar | Tombol selalu membuka three-vessels | Tidak melanjutkan sesi yang sedang dikerjakan | Cari sesi aktif; jika kosong buka katalog |
| Tautan langsung | Splash mengarahkan ke halaman utama | Deep link kasus/simulasi dapat hilang saat kunjungan awal | Splash tidak lagi mengganti alamat tujuan |
| Kasus tidak dikenal | useCase kembali ke kasus pertama | URL salah dapat menampilkan kasus yang tidak dimaksud | Validasi slug dan tampilkan Case not found |
| Konten klinis | Kasus dibuat dari seed yang memakai anamnesis, obat, lab, dan feedback generik sama | Spesifisitas klinis dan mutu pengecoh rendah | Label templat yang belum ditelaah; penggantian seluruh konten menjadi pekerjaan lanjutan |

## Pengalaman bermain yang telah dibuat

Mode Simulasi Jaga dapat diakses melalui menu atau kartu pada dashboard. Lobi menjelaskan tujuan latihan dan menawarkan Mode Belajar serta Mode Jaga. Pemain bertemu pasien fiktif di Bed 01, melihat ilustrasi ruang observasi, monitor empat tanda vital, dan handover perawat.

Alur terdiri atas lima keputusan: mengenali ketidakstabilan; memilih pemeriksaan bedside; menyatukan temuan klinis dan echo; menentukan prioritas intervensi oleh tim; serta menilai ulang setelah intervensi. Rekam medis membuka temuan sesuai tahapan, sehingga diagnosis tidak langsung diberikan pada awal. Tab Catatan menyimpan tindakan yang benar-benar dipilih pemain.

Setiap keputusan memiliki satu jawaban yang diprioritaskan dalam skenario, penjelasan, 0 atau 20 poin, dan biaya waktu skenario. Mode Jaga mempunyai target 10 menit. Ini waktu diskret berdasarkan pilihan, bukan timer nyata. Bila target terlampaui, latihan tetap dapat diselesaikan dan debrief menjelaskan keterlambatan. Tidak ada penalti kecepatan membaca atau klaim kematian pasien berdasarkan timer.

Monitor mengikuti tahap cerita yang sudah ditentukan. Angka bukan keluaran model fisiologis, tidak memprediksi respons terapi, dan tidak berubah secara klinis adaptif akibat pilihan pemain. Pilihan yang kurang tepat menimbulkan feedback dan biaya waktu; cerita kemudian berlanjut untuk memastikan seluruh sasaran pembelajaran tercapai. Jadi, implementasi ini merupakan simulasi keputusan bertahap, belum mesin pasien bercabang penuh.

Debrief memperlihatkan skor aktual, total waktu skenario, keputusan tepat, tindakan yang dipilih, alasan, dan prioritas pembanding untuk jawaban yang kurang tepat. Sesi dapat dilanjutkan setelah reload, diulang, atau diganti mode. Sesi simulasi terpisah dari progres kasus lama; belum digabung menjadi XP atau streak.

## Dasar konten skenario baru

Dasar klinis diambil dari 2025 ESC Guidelines for the management of myocarditis and pericarditis, bagian 11.8 mengenai tamponade jantung. Rujukan mendukung penilaian klinis bersama ekokardiografi dan penanganan segera pada pasien tidak stabil, dengan pemilihan pendekatan drainase oleh tim berpengalaman sesuai konteks. Angka tanda vital, durasi permainan, skor, dan dialog adalah ilustrasi yang dibuat untuk permainan; bukan data pasien atau hasil penelitian.

Rujukan: https://academic.oup.com/eurheartj/article/46/40/3952/8234483 (DOI 10.1093/eurheartj/ehaf192).

Penyebutan guideline tidak sama dengan validasi skenario. Skenario tetap membutuhkan telaah spesialis BTKV/kardiologi dan uji penggunaan sebelum dipakai untuk penilaian peserta didik. Permainan tidak memberi panduan teknik invasif, dosis obat, atau rekomendasi untuk pasien nyata.

## Arsitektur dan keputusan teknis

Aplikasi tetap React, TypeScript, dan Vite. Mesin tahapan simulasi dipisahkan dalam src/game/ward.ts, sehingga aturan poin, waktu, submit tunggal, dan akhir sesi dapat diuji tanpa browser. Komponen permainan berada di src/pages/Ward.tsx dan gaya di ward.css. Ilustrasi ruang pasien berupa SVG lokal, sehingga tidak memerlukan layanan gambar eksternal.

State reaktif bersama mencegah beberapa komponen menampilkan salinan progres yang berbeda. Jika browser menolak penyimpanan atau kuota penuh, aplikasi memakai state sementara dalam memori dan menampilkan pemberitahuan bahwa sesi dapat hilang saat halaman ditutup. Penyimpanan browser tetap dapat dihapus pengguna dan belum menjadi sinkronisasi lintas perangkat.

Skor templat lama yang sebelumnya selalu 80 tidak diimpor sebagai bukti kemampuan. Progres terverifikasi memakai kunci versi baru. Entri lama tetap tersimpan sampai pengguna mereset data; favorit dipertahankan. XP berasal dari hasil kasus yang tercatat, tidak bertambah hanya karena membuka halaman atau me-refresh hasil. Pengulangan mengganti hasil terakhir per kasus; belum ada riwayat lengkap setiap percobaan atau best score terpisah.

## Prioritas pengembangan berikutnya

1. **Telaah konten 18 kasus.** Ganti seed generik dengan usia, keluhan, tanda vital konsisten, temuan penunjang, diagnosis banding yang masuk akal, dan pengecoh yang menguji kesalahan penalaran nyata. Kasus anak memerlukan data dan obat yang sesuai kelompok usia. Setiap jawaban perlu alasan spesifik dan rujukan teridentifikasi.
2. **Rubrik rencana operasi per kasus.** Bedakan tindakan wajib, tindakan berbahaya, alternatif yang dapat diterima, dan keputusan yang bergantung sumber daya. Jangan mengubah pilihan generik menjadi nilai kompetensi.
3. **Tambahkan cabang respons pasien.** Misalnya stabilisasi, ketidakpastian diagnosis, atau keterbatasan fasilitas. Tetapkan perubahan parameter yang direview pakar dan beri label sebagai model permainan. Skenario tamponade saat ini tetap satu jalur pembelajaran.
4. **Perluas skenario BTKV yang spesifik.** Kandidat: perdarahan pascabedah, acute limb ischemia, sindrom aorta akut, pneumotoraks, serta pemantauan drainase dada. Setiap skenario harus ditelaah sebelum dianggap selesai secara klinis.
5. **Pengalaman perangkat kecil.** Tata letak baru menggunakan kolom tunggal pada layar sempit. Pengujian pada ponsel fisik, pembaca layar, fokus dialog, kontras, dan kondisi jaringan lambat tetap diperlukan.
6. **Akun dan sinkronisasi bila dibutuhkan.** Backend baru dibutuhkan untuk progres lintas perangkat, dashboard pengajar, ruang kelas, dan leaderboard nyata. Hindari leaderboard berisi pemain atau angka fiktif.
7. **Evaluasi pendidikan.** Lakukan uji kegunaan, telaah validitas isi, dan perbandingan pre/post yang sesuai. Skor permainan saat ini belum mempunyai validitas untuk sertifikasi atau penilaian kompetensi.

## Kriteria penerimaan

Versi ini harus dapat dimainkan dari awal sampai debrief; menghitung hasil dari keputusan aktual; tidak menerima submit ganda; melanjutkan sesi setelah reload; menampilkan temuan sesuai tahap; serta tetap menyelesaikan latihan saat target waktu terlampaui. Untuk bank kasus, jawaban semuanya benar harus 100 dan semuanya salah 0, hasil tidak dapat dibuat dari sesi kosong, dan posisi jawaban benar harus bervariasi.

Verifikasi otomatis dan browser dicatat dalam pull request. Pemeriksaan browser desktop tidak menggantikan pengujian ponsel fisik atau telaah klinis.

@extends('PDF.PlainTemplate')
@section('title')
    BPJS - {{ $data->name }}
@endsection
@section('number_document')
    No. {{ $offboarding->id }}/BPJS/HRD/{{ $documentID }}
@endsection
@section('approval_name')
    {{ $data->name }}
@endsection
@section('container')
    <div class="p-page text-smaller">
        <div class="text-center capitalize">
            <h2>
                FORM PERNYATAAN SOSIALISASI BPJS KESEHATAN
            </h2>
        </div>
        <br>
        <p class="text-justify">
            Saya yang bertanda tangan dibawah ini:
        </p>
        <table width="100%" class="ml-10">
            <tr>
                <td width="40%">Nama</td>
                <td>: {{ $data->name }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $data->nik }}</td>
            </tr>
        </table>
        <br>
        <p class="text-justify">
            Dengan ini menyatakan bahwa Saya telah menerima materi sosialisasi BPJS Kesehatan bagi karyawan nonaktif
        </p>
        <br>
        <hr>
        <br>
        <p class="text-justify"><b>PANDUAN PINDAH KEPESERTAAN BPJS KESEHATAN KARYAWAN NON-AKTIF</b></p>
        <p class="text-justify">
            BPJS Kesehatan merupakan program wajib yang harus diikuti oleh setiap warga negara Indonesia. Selama Bapak/Ibu
            bergabung bersama PT Indosat, perusahaan menanggung iuran BPJS Kesehatan. Setelah Bapak/Ibu non aktif, maka
            Perusahaan akan menonaktifkan kepesertaan BPJS Kesehatan sebagai tanggungan perusahaan dengan tanggal efektif
            pada tanggal 1 di bulan berikutnya setelah tanggal non aktif Bapak/Ibu
        </p>
        <p class="text-justify">
            Setelah dinonaktifkan sebagai tanggungan perusahaan, Bapak/Ibu dapat meneruskan kepesertaan BPJS Kesehatan
            sebagai peserta mandiri atau dipindahkan sebagai tanggungan di perusahaan baru atau tanggungan di perusahaan
            pasangan.
        </p>
        <ol type="1" class="text-justify">
            <li>
                <b>Menjadi peserta mandiri</b>
                <p class="text-justify">
                    Setelah dinonaktifkan sebagai tanggungan perusahaan, Bapak/Ibu dapat meneruskan kepesertaan BPJS
                    Kesehatan
                    sebagai peserta mandiri atau dipindahkan sebagai tanggungan di perusahaan baru atau tanggungan di
                    perusahaan
                    pasangan.
                <ol type="a">
                    <li>Kartu BPJS Kesehatan yang dapat diunduh di aplikasi mobile JKN</li>
                    <li>KTP **</li>
                    <li>Kartu Keluarga ** </li>
                    <li>buku nikah (jika sudah menikah) **</li>
                    <li>Akte kelahiran anak **</li>
                    <li>Buku rekening **</li>
                    <li>Formular Pendaftaran (form ini dilengkapi jika mendaftar di kantor BPJS Kesehatan terdekat dan dapat
                        dimintakan di kantor BPJS Kesehatan)</li>
                </ol>
                <br>
                ** siapkan berkas asli dan fotocopy jika mendaftar langsung ke kantor BPJS Kesehatan terdekat
                <br>
                </p>
                <p class="text-justify">
                    Besaran iuran bulanan/peserta BPJS Kesehatan peserta mandiri yang dapat dipilih adalah sebagai berikut:
                <ol type="i">
                    <li>KELAS I : Rp 150.000,- /bulan/peserta</li>
                    <li>KELAS II : Rp 100.000,- /bulan/peserta</li>
                    <li>KELAS III : RP 35.000,- /bulan/peserta</li>
                </ol>
                </p>
                <p class="text-justify">
                    * PANDAWA (Pelayanan Administrasi Melalui Whatsapp) adalah layanan online BPJS KESEHATAN.
                    Bagi peserta BPJS Kesehatan yang ingin mendapatkan pelayanan administrasi melalui PANDAWA, peserta bisa
                    mendapatkan pelayanan PANDAWA melalui CHIKA, dengan alur sebagai berikut:
                <ol type="1">
                    <li>
                        Peserta dapat mengakses Layanan CHIKA
                        <p>
                            melalui Chatting Whatsapp ke nomor 08118750400, Facebook Massenger BPJS Kesehatan, atau melalui
                            Telegram ke (https://t.me/BPJSKes_bot).
                        </p>
                    </li>
                    <li>
                        Setelah CHIKA merespon, CHIKA akan menampilkan jenis pelayanan CHIKA dan Peserta dapat memilih jenis
                        layanan administrasi
                    </li>
                    <li>
                        Kemudian CHIKA akan menampilkan Jenis Layanan PANDAWA dan peserta dapat memilih 1 jenis layanan.
                    </li>
                    <li>
                        Setelah memilih 1 jenis layanan yang dibutuhkan, selanjutnya peserta memilih domisili provinsi dan
                        kantor cabang sesuai dengan tempat tinggal peserta
                    </li>
                    <li>
                        Langkah terakhir, CHIKA akan memberikan form pelaporan yang wajib di isi oleh peserta dan
                        mengirimkan form pelaporan ke nomor Whatsapp Kantor Cabang sesuai dengan wilayah daerah peserta
                        tinggal (No Whatsapp sesuai dengan informasi yang diberikan CHIKA).
                    </li>
                </ol>
                <p>
                    Peserta akan di hubungi oleh Petugas Admin PANDAWA Kantor Cabang untuk membantu proses administrasi
                    sesuai kebutuhan peserta. Informasi lebih lanjut hubungi Care Center BPJS Kesehatan 1500 400.
                </p>
                </p>
            <li>
                <b>Melanjutkan kepesertaan BPJS Kesehatan di perusahaan baru</b>
                <p class="text-justify">Bapak/Ibu Silahkan laporkan nomer BPJS Kesehatan Bapak/Ibu dan keluarga ke HRD Perusahaan. Selanjutnya, pihak HRD yang akan mengurus perpindahan kepesertaan BPJS Kesehatan Bapak/Ibu dan keluarga.</p>
            </li>
            <li>
                <b>Melanjutkan kepesertaan BPJS Kesehatan sebagai keluarga di perusahaan pasangan</b>
                <p class="text-justify">Pasangan Bapak/Ibu Silahkan laporkan ke HRD Perusahaan bahwa ingin menambahkan anggota keluarga di BPJS Kesehatan dengan menyampaikan nomer peserta BPJS Kesehatan dan surat keterangan pernah bekerja milik Bapak/Ibu. Selanjutnya, pihak HRD yang akan mengurus perpindahan kepesertaan BPJS Kesehatan Bapak/Ibu dan keluarga menjadi tanggunan perusahaan pasangan Bapak/Ibu.</p>
            </li>
        </ol>
        <br>
        <div class="text-small">
            Dokumen ini sudah disetujui oleh :
            <ol>
                <li>{{ $data->name }} - Penanggung Jawab Lama</li>
            </ol>
        </div>
        {{-- <p class="text-center">{{ date('d F Y') }}</p> --}}
        {{-- <p class="text-small">{{ $svp->name }}</p> --}}
    </div>
@endsection

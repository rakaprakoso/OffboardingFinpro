@extends('PDF.PlainTemplate')
@section('title')
    Termination Letter - {{ $data->name }}
@endsection
@section('number_document')
    No. {{ $offboarding->id }}/TL/HRD/{{ $documentID }}
@endsection
@section('approval_name')
{{ $data->name }}
@endsection
@section('container')
    <div class="p-page text-smaller">
        <div class="text-center capitalize">
            <h2>
                SURAT PERNYATAAN<br>
                KARYAWAN PT INDOSAT Tbk YANG BERHENTI
            </h2>
        </div>
        <hr>
        <table width="100%" class="ml-10">
            <tr>
                <td width="40%">Nama</td>
                <td>: {{ $data->name }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $data->nik }}</td>
            </tr>
            <tr>
                <td>No. KTP</td>
                <td>: {{ $data->ktp }}</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>: {{ $data->address }}</td>
            </tr>
            <tr>
                <td>No. Telfon</td>
                <td>: {{ $data->phone }}</td>
            </tr>
        </table>
        <br>
        <p class="text-justify">
            Sehubungan dengan telah berhentinya saya di INDOSAT, maka saya akan tetap menjaga
            kerahasiaan segala informasi rahasia milik INDOSAT tersebut di atas dan menyatakan hal hal sebagai berikut :
        </p>
        <br>
        <ol type="1" class="text-justify">
            <li>
                Tidak akan menerbitkan, mengungkapkan, menggunakan atau memberi hak kepada
                seseorang atau pihak lainnya untuk menerbitkan, mengungkapkan atau menggunakan
                tanpa otorisasi tertulis dari INDOSAT baik secara terbuka maupun rahasia (sembunyi) suatu informasi
                di bidang teknologi dan/atau bisnis yang diperoleh maupun
                yang dipelajari, dikembangkan, atau yang diciptakan saat saya bekerja di INDOSAT.</li>
            <li>
                Tidak akan menggunakan komputer, mengungkapkan sesuatu tanpa otorisasi, dan
                mengakses kata sandi atau kode milik INDOSAT yang dapat digunakan, baik secara
                terbuka maupun sembunyi-sembunyi suatu informasi yang dimiliki oleh INDOSAT baik
                informasi di bidang teknologi dan/atau bisnis yang belum menjadi informasi yang bersifat
                umum diketahui oleh masyarakat . Informasi tersebut termasuk namun tidak terbatas
                pada :
                <ol type="a">
                    <li>
                        Penemuan-penemuan dibidang Hak atas Kekayaan Intelektual (“HaKI”) dan/atau
                        teknologi baik yang telah didaftarkan maupun yang belum dan/atau akan didaftarkan
                        di Direktorat Jenderal HaKI dan diatur dalam UU No. 30 Tahun 2000 tentang
                        Rahasia Dagang , UU No. 31 Tahun 2000 tentang Desain Industri , UU No. 32 Tahun
                        2000 Tentang Desain Tata Letak Sirkuit Terpadu, UU No. 14 Tahun 1997 Tentang
                        Perubahan atas UU No. 19 Tahun 1992 Tentang Merk, dan UU No. 12 tahun 1997
                        Tentang Perubahan Atas UU No. 6 tahun 1989 Tentang Paten.
                    </li>
                    <li>
                        Informasi spesifik, mencakup informasi yang terdapat pada permohonan paten,
                        seperti : rencana dan hasil riset, penemuan, material, proses, perancangan
                        peralatan dan piranti (instrumen) , bantuan rancang-bangun, manual instalasi, dan
                        perangkat lunak komputer, gambar bangunan/gedung dan program-program
                        komputer yang digunakan secara rutin.
                    </li>
                    <li>
                        Manajemen teknologi informasi, misalnya : proposal-proposal, komponen-komponen
                        dan kriteria sistim penilaian karya beserta analisanya termasuk didalamnya aspekaspek yang perlu
                        dikembangkan dari diri karyawan.
                    </li>
                    <li>
                        Informasi keuangan, meliputi tetapi tidak terbatas pada modal dan hutang
                        perusahaan , neraca, perhitungan rugi-laba , arus kas biaya produksi atas produk
                        tertentu, data dan/atau biaya jasa, pendapatan dan keuntungan perusahaan.
                    </li>
                    <li>
                        Informasi bisnis berupa data penjualan dan strategi pemasaran seperti: usulan
                        proyek, studi pemasaran, rencana-rencana dan pemikiran-pemikiran untuk
                        pengembangan, informasi pelanggan, produk baru yang belum diumumkan, strategi,
                        serta jaringan pelanggan yang berupa data pelanggan-pelanggan khusus beserta
                        informasi tagihannya.
                    </li>
                    <li>
                        Informasi mengenai karyawan seperti : data pribadi dan keluarga, gaji, surat tugas,
                        pendidikan serta tinjauan kenaikan gaji.<br>
                        Informasi kepemilikan dapat berupa format dan tidak dapat diukur
                        seperti: pengetahuan , konsep-konsep atau gagasan-gagasan, maupun
                        berupa format yang dapat diukur seperti suatu dokumen.<br>
                        Istilah dokumen meliputi surat peringatan tertulis, gambar-gambar, material
                        pelatihan, rincian-rincian dan/atau hitungan-hitungan, buku catatan surat-surat
                        masuk, foto, desain grafis baik dalam bentuk “soft copy” maupun “hard copy”,
                        perangkat-perangkat lunak yang dibeli dari pihak ketiga maupun model (contohc ontoh produk).
                    </li>
                </ol>
            </li>
            <li>
                Dengan ini menjamin bahwa saya telah mengembalikan kepada PT Indosat Tbk, seluruh
                dokumen asli maupun salinannya yang berisikan informasi Rahasia, baik dalam bentuk
                soft copy maupun hard copy yang saya peroleh secara langsung maupun tidak langsung
                dalam hubungan ketenagakerjaan saya dengan PT Indosat Tbk.
            </li>
            <li>
                Bersedia menyelesaikan kewajiban yang timbul dari excess (kelebihan biaya) dari
                penggunaan Fasilitas Kesehatan yang telah digunakan oleh saya dan/atau anggota
                keluarga saya.
            </li>
            <li>
                Bersedia menyelesaikan kewajiban yang timbul dari excess (kelebihan biaya) dari
                Plafon Fasilitas Telepon Operasional (Pascabayar) yang telah ditentukan oleh PT.
                INDOSAT, Tbk
            </li>
            <li>
                Selanjutnya saya menjamin bahwa saya tetap akan mematuhi Pernyataan Kerahasiaan
                Informasi yang telah saya tandatangani.

            </li>
            <li>Pelanggaran terhadap ketentuan tersebut diatas, dapat berakibat terjadinya tuntutan
                ganti rugi oleh perusahaan di muka pengadilan.
            </li>
            <li>
                Demikian Surat Pernyataan ini saya buat dengan sebenar-benarnya, dengan kesadaran
                penuh dan tanpa paksaan dari pihak manapun.
            </li>
            <li>
                Surat Pernyataan ini tidak dapat dicabut kembali dengan alasan apapun
            </li>
        </ol>
        <br>
        {{-- <p class="text-center">{{ date('d F Y') }}</p> --}}
        {{-- <p class="text-small">{{ $svp->name }}</p> --}}
    </div>
@endsection

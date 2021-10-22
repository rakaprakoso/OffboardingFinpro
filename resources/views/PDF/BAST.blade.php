@extends('PDF.Template')
@section('title')
    BAST - {{ $data->name }}
@endsection
@section('number_document')
    No. {{ $offboarding->id }}/BAST/IT/{{ $documentID }}
@endsection
@section('container')
    <div class="p-page">
        <div class="mt-10">
            <p class="text-right">Jakarta, {{ date('d F Y') }}</p>
            <div class="text-center">
                <p><strong>
                        FORM BAST PENARIKAN PERANGKAT IT
                        <br>PT. INDOSATOOREDOO, Tbk
                    </strong></p>
                <p>CO Number : @yield('number_document')</p>
            </div>
        </div>
        <br />
        <ol>
            <li>
                <b>Data Karyawan Penanggung Jawab Perangkat Lama</b>
                <table width="100%" class="ml-10">
                    <tr>
                        <td width="15%">Nama</td>
                        <td width="35%">: {{ $data->name }}</td>
                        <td width="15%">NIK</td>
                        <td width="35%">: {{ $data->nik }}</td>
                    </tr>
                    <tr>
                        <td width="15%">Departemen</td>
                        <td width="35%">: {{ $data->department->name }}</td>
                        <td width="15%">Lokasi</td>
                        <td width="35%">: {{ $data->department->location->city }}</td>
                    </tr>
                </table>
            </li>
            <li>
                <b>Perangkat yang Ditarik & Diserahterimakan</b>
                <table class="text-small table table-striped" width="100%">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Serial Code</th>
                            <th>Item</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    @foreach ($offboarding->exitClearance->it as $item)
                    <tr>
                        <td>{{$loop->iteration}}</td>
                        <td>{{$item['Code']}}</td>
                        <td>{{$item['Item']}}</td>
                        <td>{{$item['Qty']}}</td>
                    </tr>
                    @endforeach
                </table>
            </li>
            <li>
                <b>Tata Tertib Standard Pelayanan IT (Merujuk Pada Policy NODIN No. 024/DHR/HRD/08)</b>
                <ol type="1" class="text-small text-justify">
                    <li>User/penanggung jawab perangkat wajib mengganti atas perangkat yang hilang atau tidak diketahui keberadaannya sesuai dengan kebijakan perusahaan.</li>
                    <li>User/pengguna/penanggung jawab perangkat wajib memeriksa dan memastikan kesesuaian antara lembar BAST ini dengan fisik perangkat.</li>
                    <li>User/penanggung jawab perangkat berhak dan wajib meminta form serah terima perangkat dan atau form penarikan perangkat bila perangkat diserahterimakan ke IT.</li>
                    <li>User/penanggung jawab perangkat wajib menjaga keutuhan spesifikasi dan penampilan perangkat.</li>
                    <li>Untuk karyawan tetap, bila dimutasi wajib membawa perangkat personal dan menyerahkanterimakan perangkat sharing dan melaporkan ke IT.</li>
                    <li>Setiap aplikasi dan software yang diinstall di luar standard IT menjadi tanggung jawab user/penanggung jawab perangkat.</li>
                    <li>Akan dilakukan format pada perangkat dalam waktu 3 (tiga) hari setelah tanggal penarikan, semua data dalam perangkat akan musnah dan tidak bisa direstore.</li>
                </ol>
            </li>
            {{-- <li>
                <b>Catatan Petugas IT</b>
                <p></p>
            </li> --}}
        </ol>

        <div class="text-small">
            Dokumen ini sudah disetujui oleh :
            <ol>
                <li>{{ $data->name }} - Penanggung Jawab Lama - {{ date('Y-m-d H:i:s') }}</li>
                <li>IT Staff - {{ date('Y-m-d H:i:s') }}</li>
                <li>Retno Kusumo Rini - HRBP Manager - {{ date('Y-m-d H:i:s') }}</li>
            </ol>
        </div>
        {{-- <img src="{{'data:image/svg+xml;utf8,'.rawurlencode(str_replace(["\r", "\n"], ' ', QrCode::size(250)->generate('ItSolutionStuff.com')))}}" alt="QR Code"> --}}

        {{-- {!! QrCode::size(250)->generate('ItSolutionStuff.com'); !!} --}}
        {{-- <p class="text-small">{{ $svp->name }}</p> --}}
    </div>
@endsection

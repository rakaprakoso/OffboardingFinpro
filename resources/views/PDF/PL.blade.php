@extends('PDF.Template')
@section('title')
    Personnel Letter - {{ $data->name }}
@endsection
@section('number_document')
No. {{ $offboarding->id }}/PL/HRD/{{ $documentID }}
@endsection
@section('container')
    <div class="p-page">
        <div class="mt-10">
            <p class="text-right">Jakarta, {{ date('d F Y') }}</p>
            <p><strong><em>PRIBADI & RAHASIA</em></strong></p>
            <p>@yield('number_document')</p>
            <br />
            {{-- <p> --}}
            <p><strong>{{ $data->name }} / NIK : {{ $data->nik }}</strong></p>
            <p>{{ $data->job_detail->title }}</p>
            <p>{{ $data->department->name }} - {{ $data->department->location->city }}</p>
            <p>PT Indosat Tbk</p>
            {{-- </p> --}}
        </div>
        <br />
        <br />
        <p>Hal : Persetujuan Karyawan Berhenti</p>
        <br />
        <p>Dengan hormat,</p>
        <br />
        <p class="text-justify">
            Kami informasikan bahwa permohonan pengunduran diri Saudara telah kami setujui. Terhitung
            mulai tanggal {{ date_format(date_create($offboarding->effective_date), 'd F Y') }} Saudara efektif berhenti
            dari PT Indosat
            Tbk.</p>
        <br />
        <p class="text-justify">
            Atas nama Manajemen, kami mengucapkan terima kasih atas loyalitas yang telah diberikan
            untuk PT Indosat Tbk. dan semoga Saudara mendapatkan yang terbaik.
        </p>
        <br>
        <div class="text-small">
            Dokumen ini sudah disetujui oleh :
            <ol>
                <li>{{ $svp->name }} - {{$svp->job_detail->title }}</li>
            </ol>
        </div>
        {{-- <p class="text-small">{{ $svp->name }}</p> --}}
    </div>
@endsection

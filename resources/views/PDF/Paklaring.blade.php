@extends('PDF.Template')
@section('title')
    Paklaring - {{ $data->name }}
@endsection
@section('number_document')
    No. {{ $offboarding->id }}/PKL/HRD/{{ $documentID }}
@endsection
@section('container')
    <div class="p-page">
        <div class="mt-10">
            <p class="text-right">Jakarta, {{ date('d F Y') }}</p>
            <div class="text-center">
                <p><u><strong>SURAT KETERANGAN</strong></u></p>
                <p>@yield('number_document')</p>
            </div>
        </div>
        <br />
        <br />
        <p>Yang bertanda tangan di bawah ini :</p>
        <br />
        <br />
        <table width="100%" class="ml-10">
            <tr>
                <td width="40%">Nama</td>
                <td>: {{ $svp->name }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $svp->nik }}</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>: {{ $svp->job_detail->title }}</td>
            </tr>
            <tr>
                <td>Unit Kerja</td>
                <td>: {{ $svp->department->name }}</td>
            </tr>
        </table>
        <br />
        <p>Menerangkan bahwa :</p>
        <br />
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
                <td>Jabatan Terakhir</td>
                <td>: {{ $data->job_detail->title }}</td>
            </tr>
            <tr>
                <td>Unit Kerja Terakhir</td>
                <td>: {{ $data->department->name }}</td>
            </tr>
            <tr>
                <td>Lokasi</td>
                <td>: {{ $data->department->location->city }}</td>
            </tr>
        </table>
        <br />
        <p class="text-justify">adalah benar telah bekerja di PT Indosat Tbk sejak tanggal
            {{ date_format(date_create($data->hire_date), 'd F Y') }} sampai dengan
            tanggal {{ date_format(date_create($offboarding->effective_date)->modify('-1 days'), 'd F Y') }}.
        </p>
        <br />
        <p class="text-justify">
            Surat Keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
        <br>
        <div class="text-small">
            Dokumen ini sudah disetujui oleh :
            <ol>
                <li>{{ $svp->name }} - {{$svp->job_detail->title }}</li>
            </ol>
        </div>
        {{-- <img src="{{'data:image/svg+xml;utf8,'.rawurlencode(str_replace(["\r", "\n"], ' ', QrCode::size(250)->generate('ItSolutionStuff.com')))}}" alt="QR Code"> --}}

        {{-- {!! QrCode::size(250)->generate('ItSolutionStuff.com'); !!} --}}
        {{-- <p class="text-small">{{ $svp->name }}</p> --}}
    </div>
@endsection

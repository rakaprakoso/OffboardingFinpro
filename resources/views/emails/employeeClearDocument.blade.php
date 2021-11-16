@extends('emails.template')
@if ($type == 1)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        SVP
    @endsection
    @section('message')
        Mohon update konfirmasi exit interview form dari karyawan :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&exitInterview=true"
    @endsection
    @section('cta')
        Konfirmasi
    @endsection

@elseif ($type == 2)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        All
    @endsection
    @section('message')
        Mohon cek dokumen yang dikirim oleh karyawan :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        @if (isset($options))
        Kode Input : <strong>{{ $options }}</strong>   <br>
        @endif
        Silahkan konfirmasi melalui lini dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=5&inputToken={{ isset($options) ? $options : null }}"
    @endsection
    @section('cta')
        Konfirmasi
    @endsection

@elseif ($type == 3)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Terdapat kekurangan pada pengembalian item pada :<br>
        {{-- {{json_encode($messageEmail)}} --}}
        {{-- {{ json_encode($message) }} --}}
        Dept : <strong>{{ $messageEmail['dept'] }}</strong><br>
        Item : <strong>{{ $messageEmail['message'] }}</strong><br>
        Hubungi PIC terkait untuk detail pengembalian barang
    @endsection
@elseif ($type == 4)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Proses offboarding anda sudah selesai silahkan mengecek offboarding dashboard anda untuk mendownload lampiran file
        dan dokumen terkait keluar<br>
        Terima Kasih pernah menjadi keluarga Indosat Ooredoo
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
        Lihat Data
    @endsection
@elseif ($type == 5)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        Payroll
    @endsection
    @section('message')
        Mohon dapat dilakukan Pembayaran Hak dan Kewajiban Karyawan Berhenti <br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Karena proses offboarding sudah selesai
    @endsection
@elseif ($type == 6)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
    {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
       Silahkan cek pada dashboard offboarding anda. Terdapat komentar dan catatan terkait proses keluar anda.
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
        Lihat Data
    @endsection
@endif

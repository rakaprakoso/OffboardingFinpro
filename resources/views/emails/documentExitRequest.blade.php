@extends('emails.template')
@if ($type == 1)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        All
    @endsection
    @section('message')
        Mohon update masing-masing PIC untuk Kewajiban Karyawan Berhenti berikut ini :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        @if (isset($options))
        Kode Input : <strong>{{ $options }}</strong>   <br>
        @endif
        Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&newVersion=true&inputToken={{ isset($options) ? $options : null }}"
    @endsection
    @section('cta')
        Lengkapi Data
    @endsection

@elseif ($type == 2)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        HR Manager
    @endsection
    @section('message')
        Diberitahukan terdapat Karyawan yang mengundurkan diri :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Untuk menyelesaikan proses offboarding silahkan klik ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&approval=hrmgr"
    @endsection
    @section('cta')
        Selesaikan Proses
    @endsection

@elseif ($type == 3)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
        HRBP
    @endsection
    @section('message')
        Mohon update offboarding karyawan :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->nik }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Setelah melakukan Exit Interview. Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&exitInterview=true"
    @endsection
    @section('cta')
        Update Data
    @endsection
@elseif ($type == 4)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
    {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Mohon cek proses offboarding anda, terdapat catatan barang ataupun dokumen yang harus dikembalikan. Untuk detailnya silahkan lihat di dashboard Offboarding anda.
        Data dapat dilihat dan diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
        Update Data
    @endsection
@elseif ($type == 5)
    @section('title')
        {{ $subject }}
    @endsection
    @section('recipient')
    Payroll
    @endsection
    @section('message')
        Untuk melanjutkan proses offboarding karyawan atas nama <strong>{{ $offboardingData->employee->name }}</strong> mohon mengonfirmasi perhitungan payroll.
        Data dapat di input pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&payroll=true"
    @endsection
    @section('cta')
        Konfirmasi
    @endsection
@endif

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
        NIK : <strong>{{ $offboardingData->employee->NIK }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&newVersion=true"
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
        Mohon approval dokumen berhenti Karyawan yang mengundurkan diri :<br>
        Nama : <strong>{{ $offboardingData->employee->name }}</strong><br>
        NIK : <strong>{{ $offboardingData->employee->NIK }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&approval=hrmgr"
    @endsection
    @section('cta')
        Konfirmasi
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
        NIK : <strong>{{ $offboardingData->employee->NIK }}</strong><br>
        Tanggal Berhenti : <strong>{{ $offboardingData->effective_date }}</strong><br>
        Setelah melakukan Exit Interview. Data dapat diinput pada link dibawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&process=3&exitInterview=true"
    @endsection
    @section('cta')
        Update Data
    @endsection
@endif

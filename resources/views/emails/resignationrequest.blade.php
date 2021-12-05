@extends('emails.template')
@if ($type == 1)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        SVP
    @endsection
    @section('message')
        Kami ingin memberitahukan bahwa karyawan dengan
        nama :
        <strong>{{ $offboardingData->employee->name }}</strong>
        mengajukan diri untuk resign dari perusahaan
        ini. Untuk melanjutkan proses resign karyawan
        tersebut, silahkan dikonfirmasi dengan klik link
        dibawah ini.
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}"
    @endsection
    @section('cta')
        Konfirmasi
    @endsection

@elseif ($type == 2)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Terdapat pengajuan pengunduran diri atas nama anda pada dashboard offboarding.
        Untuk melanjutkan atau membatalkan proses, silahkan melakukan konfirmasi pada portal kami. Data dapat diinput melalui link :
        {{-- Apabila anda tidak merasa
        melakukan pengunduran diri, silahkan
        klik ini untuk membatalkan --}}
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
        Konfirmasi
    @endsection

@elseif ($type == 3)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
       <b> Proses pengunduran diri anda sudah disetujui oleh SVP</b> anda tetapi ada perubahan tanggal effective date dari
        yang anda ajukan menjadi {{ $offboardingData->effective_date }}. Proses Offboarding anda dapat dilihat pada dashboard anda melalui link di bawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
        Lihat Data
    @endsection
@elseif ($type == 4)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        <b>Proses pengunduran diri anda sudah disetujui oleh SVP</b> anda. Proses Offboarding anda dapat dilihat pada dashboard anda melalui link di bawah ini :
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/employee/{{ $offboardingData->id }}/?token={{ $offboardingData->employee_token }}"
    @endsection
    @section('cta')
    Lihat Data
    @endsection
@elseif ($type == -2)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Proses pengunduran diri anda tidak disetujui oleh SVP anda.
    @endsection
@elseif ($type == -3)
    @section('title')
        {{$subject}}
    @endsection
    @section('recipient')
        HR SS
    @endsection
    @section('message')
    Karyawan atas nama : {{ $offboardingData->employee->name }} membatalkan pengunduran diri
    @endsection
@endif

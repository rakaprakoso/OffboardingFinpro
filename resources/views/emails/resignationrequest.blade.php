@extends('emails.template')
@if ($type == 1)
    @section('title')
        Resignation Approval
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
        Resignation Verification
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Terkait proses pengunduran diri anda dokumen
        sudah terverifikasi. Apabila anda tidak merasa
        melakukan pengunduran diri, silahkan
        klik ini untuk membatalkan
    @endsection
    @section('url')
        "{{ config('app.url') }}/offboarding/{{ $offboardingData->id }}/?token={{ $offboardingData->token }}&rejectEmployee=true"
    @endsection
    @section('cta')
        Batalkan Resign
    @endsection

@elseif ($type == 3)
    @section('title')
        Effective Date Changed
    @endsection
    @section('recipient')
        {{ $offboardingData->employee->name }}
    @endsection
    @section('message')
        Proses pengunduran diri anda sudah disetujui oleh SVP anda tetapi ada perubahan tanggal effective date dari
        yang anda ajukan menjadi {{ $offboardingData->effective_date }}
    @endsection
@elseif ($type == -3)
    @section('title')
    Offboarding Cancel
    @endsection
    @section('recipient')
        HR SS
    @endsection
    @section('message')
    Karyawan atas nama : {{ $offboardingData->employee->name }} membatalkan pengunduran diri
    @endsection
@endif

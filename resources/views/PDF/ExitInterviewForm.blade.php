@extends('PDF.PlainTemplate')
@section('title')
    Exit Interview Form - {{ $data->name }}
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
                FORMULIR WAWANCARA PENGUNDURAN DIRI
            </h2>
        </div>
        <p class="text-justify">
            Pendapat Anda selama bekerja di PT Indosat, Tbk. sangat penting dalam upaya untuk memelihara lingkungan kerja
            yang positif. Kami pastikan masukan Anda yang berharga ini akan dijaga kerahasiaannya. Untuk itu, mohon dapat
            memberikan jawaban yang lengkap, jelas dan jujur.</p>
        <br>
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
                <td>Jabatan</td>
                <td>: {{ $data->job_detail->title }}</td>
            </tr>
            <tr>
                <td>Departmen</td>
                <td>: {{ $data->department->name }}</td>
            </tr>
            <tr>
                <td>Atasan Langsung / Manager</td>
                <td>: {{ $manager->name }}</td>
            </tr>
            <tr>
                <td>Tanggal Mulai Kerja</td>
                <td>: {{ date_format(date_create($data->hire_date), 'd F Y') }}</td>
            </tr>
            <tr>
                <td>Tanggal Berhenti</td>
                <td>: {{ date_format(date_create($offboarding->effective_date), 'd F Y') }}</td>
            </tr>
        </table>
        <br>
        <hr>
        <br>
        {{-- @foreach ($offboarding->offboardingForm->exit_interview_form['data'] as $item)
            1
        @endforeach --}}
        @for ($i = 0; $i < 5; $i++)
            <div class="text-justify">
                <p class="text-normal mb-1">
                    {{ $offboarding->offboardingForm->exit_interview_form['data'][$i]['question'] }}
                </p>
                <p class="ml-10 bl-1">
                    {{ $offboarding->offboardingForm->exit_interview_form['data'][$i]['value'] }}
                </p>
            </div>
            <br>
        @endfor

        {{-- <div class="page-break"></div> --}}

        <table class="text-justify mb-10">
            <tr>
                @for ($i = 5; $i < 20; $i++)
                    @isset($offboarding->offboardingForm->exit_interview_form['data'][$i]['pretext'])
                        @if ($i != 5)
            </table>
            @if ($i != 19 || $i != 5)
                <table class="text-justify mb-10">
                    <tr>
            @endif
            @endif
            <td colspan="6" class="text-normal">
                {{ $offboarding->offboardingForm->exit_interview_form['data'][$i]['pretext'] }}
            </td>
            </tr>
            <tr class="text-center text-small lh-1">
                <td width="50%"></td>
                <td width="10%">Sangat Baik</td>
                <td width="10%">Baik</td>
                <td width="10%">Cukup</td>
                <td width="10%">Buruk</td>
                <td width="10%">Sangat Buruk</td>
            </tr>
        @endisset
        <tr>
            <td>{{ $offboarding->offboardingForm->exit_interview_form['data'][$i]['question'] }}</td>
            @php
                $label = ['Sangat Baik', 'Baik', 'Cukup', 'Buruk', 'Sangat Buruk'];
            @endphp
            @for ($j = 0; $j < 5; $j++)
                <td class="text-center">
                    {{-- <p style="margin-left: 40%"> --}}
                        <label style="margin-left: 40%;">
                            <input type="radio" name="" id=""
                                {{ $offboarding->offboardingForm->exit_interview_form['data'][$i]['value'] == $j + 1 ? 'checked' : '' }} />
                            {{-- {{ $label[$j] }} --}}
                        </label>
                    {{-- </p> --}}
                </td>
            @endfor
        </tr>
        {{-- </th> --}}
        @endfor
        </table>
        {{-- <div class="page-break"></div> --}}
        <div class="text-justify">
            <p class="text-normal mb-1">
                Apa yang akan Anda lakukan setelah mengundurkan diri dari PT Indosat, Tbk
            </p>
            @php
                $choices = ['Bekerja di perusahaan lain', 'Wirausaha/wiraswasta', 'Lainnya'];
            @endphp
            <p class="ml-10 bl-1">
                {{ $choices[$offboarding->offboardingForm->exit_interview_form['data'][20]['value'] - 1] }}
                @if ($offboarding->offboardingForm->exit_interview_form['data'][20]['value'] == '3')
                    {{ $offboarding->offboardingForm->exit_interview_form['other_activity'] }}
                @endif
            </p>
        </div>
        <br>
        @isset($offboarding->offboardingForm->exit_interview_form['additional_comment'])
            <div class="text-justify">
                <p class="text-normal mb-1">
                    Komentar tambahan
                </p>
                <p class="ml-10 bl-1">
                    {{ $offboarding->offboardingForm->exit_interview_form['additional_comment'] }}
                </p>
            </div>
            <br>
        @endisset
        <br>
    </div>
@endsection

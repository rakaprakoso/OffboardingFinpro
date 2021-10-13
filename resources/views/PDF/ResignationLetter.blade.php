@php
    if (empty($generate)) {
        $generate = '0';
    }
@endphp
<!doctype html>
<html lang="id_ID">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="/images/Logo%20Big.png" type="image/x-icon" />
    @if (Request::is('admin/cvPreview'))
        <link rel="stylesheet" href="{{ asset(mix('/css/app.css')) }}">
    @endif
    <title>Resignation - {{ $data->name }}</title>
    @if (Route::is('pdfGenerate') || $generate == '1')
        <style type="text/css">
            @font-face {
                font-family: 'PoppinsPDF';
                font-weight: 400;
                font-style: normal;
                src: url({{ storage_path('fonts\Poppins-Regular.ttf') }});
                /* src: url({{ '\fonts\Poppins-Regular.ttf' }}); */
            }

            @font-face {
                font-family: 'PoppinsPDF';
                font-weight: 700;
                font-style: normal;
                src: url({{ storage_path('fonts\Poppins-Bold.ttf') }});
                /* src: url({{ '\fonts\Poppins-Regular.ttf' }}); */
            }

            /* span {
            text-align: center;
            font-family: 'PoppinsPDF';
            font-size: 30px;
        } */

            @page {
                margin: 2.5cm;
            }

            body {
                background: #ffffff;
                margin: 0px;
                font-size: 11pt;
            }

            * {
                font-family: 'PoppinsPDF', 'Poppins', sans-serif;
            }

            .page-break {
                page-break-after: always;
            }

            a {
                color: #fff;
                text-decoration: none;
            }

            table {
                border-spacing: 0;
            }

            pre {
                display: block;
                white-space: normal;
                margin: 0;
            }

            tfoot tr td {
                font-weight: bold;
                font-size: x-small;
            }

            p,
            hr {
                line-height: 1;
                margin: 0;
            }

            table.no-spacing tr {
                line-height: 1;
            }

            br {
                line-height: 1;
            }

            .overlay {
                position: fixed;
            }

            .overlay-top {
                width: 4cm;
                left: 0cm;
                top: -2cm;
            }

            .overlay-bottom {
                left: 0;
                bottom: -1cm;
            }

            .text-small {
                font-size: 0.7rem;
            }

        </style>
    @else
        <style type="text/css">
            body {
                margin: 40px;
            }
            * {
                font-family: 'PoppinsPDF', 'Poppins', sans-serif;
                word-wrap: break-word;
            }

            .overlay {
                position: fixed;
                display: none;
            }

            .overlay-top {
                width: 20%;
                left: 0;
                top: -10%;
            }

            .overlay-bottom {
                left: 0;
                bottom: -10%;
            }

        </style>
    @endif
    <style type="text/css">
        .detail table {
            margin: 15px;
        }

        .detail h3 {
            margin-left: 15px;
        }

        .information {
            background-color: #eab308;
            color: #FFF;
        }

        .information .pic {
            width: 50%;
            border-radius: 10px;
            object-fit: cover;
        }

        .p-10 {
            padding: 40px;
        }

        .p-page {
            /* padding: 2.5cm; */
        }

        .profile h3 {
            margin-bottom: 0;
        }

        table.align-top td {
            vertical-align: top;
        }

        .logo {
            width: 100%;
            filter: drop-shadow(0 0 0.75rem rgb(80, 80, 80));
        }

        .overlay-bottom p {
            text-align: left;
            font-size: small;
        }

        .mt-10 {
            margin-top: 40px;
        }

        .ml-10 {
            margin-left: 0.5cm;
        }

        .text-right {
            text-align: right;
        }

    </style>
</head>

<body>
    <div class="overlay overlay-top">
        <img src="https://tiptronic.deprakoso.site/images/Logo%20Big.png" alt="Logo" class="logo" />
    </div>
    <div class="overlay overlay-bottom">
        <hr>
        <div class="text-small">
            No. {{$offboarding->id}}/RSGN/{{ time() }} |
            Issued by : {{ $data->name }} - {{ date('Y-m-d H:i:s') }} |
            @if (false)
            Approved by :
            {{ $data->name }} - {{ date('Y-m-d H:i:s') }}
            @else
            Waiting Approval
            @endif
        </div>
    </div>
    <div class="p-page">
        <div class="mt-10">
            <p class="text-right">Jakarta, {{ date('d F Y') }}</p>
            <br />
            {{-- <p> --}}
            <p>Yth.</p>
            <p>SVP Head of HR Business Partner</p>
            <p>HR Dept - Jakarta</p>
            <p>PT Indosat Tbk</p>
            {{-- </p> --}}
        </div>
        <br />
        <p>Dengan Hormat</p>
        <p>Saya yang bertanda tangan di bawah ini:</p>
        <table class="ml-10 no-spacing align-top" width="100%">
            <tr>
                <td>Nama</td>
                <td>: {{ $data->name }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $data->rawNIK }}</td>
            </tr>
            <tr>
                <td>Posisi</td>
                <td>: {{ $data->position }}</td>
            </tr>
            <tr>
                <td>Work Unit</td>
                <td>: {Dept. GTM & Marcomm Area - Div.
                    Regional GTM & Trade Marketing -
                    Region Kalimantan & Sumapa - Office
                    of Chief Commercial - Office of Dir. &
                    Chief Operating}</td>
            </tr>
        </table>
        <p>Mengajukan permohonan pengunduran diri sebagai karyawan di Indosat Tbk pertanggal
            <b>{{ date_format(date_create($offboarding->effective_date),"d F Y") }}</b>. Hal ini berkaitan dengan :</p>
        <br>
        <p class="ml-10">{{$offboarding->details->reason}}</p>
        <br>
        <p>Saya mengucapkan terima kasih atas dukungan dan kerja sama selama ini. Saya juga memohon maaf atas semua
            kesalahan saya selama bekerja di perusahaan.</p>
        <br>
        <p>Sekian surat pengunduran diri ini saya sampaikan. Atas perhatiannya saya mengucapkan banyak terima kasih</p>
        <br>
        {{-- <p class="text-small">{{ $data->manager_id }}</p> --}}
    </div>
    @if (Route::is('pdfPreview'))
        {!! json_encode($data) !!}
        {!! json_encode($offboarding) !!}
    @endif
    <br />
</body>

</html>

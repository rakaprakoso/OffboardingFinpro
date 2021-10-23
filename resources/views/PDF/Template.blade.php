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
    <title>@yield('title')</title>
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
                color: #222222;
            }

            .page-break {
                page-break-after: always;
            }

            a {
                /* color: #fff; */
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
                margin: 0 -1cm;
            }

            .overlay-top {
                left: 0cm;
                top: -2cm;
            }
            .overlay-top .logo{
                width: 4cm;
                display: inline-block;
            }
            .overlay-top .barcode{
                width: 10cm;
                display: inline-block;
                font-size: 8pt;
                position: absolute;
                right: 0;
                text-align: right;
            }
            .overlay-top .barcode>div{
                position: absolute;
                right: 0;
                margin-left: auto;
            }


            .overlay-bottom {
                left: 0;
                /*Debug*/
                /* bottom: -1cm; */
                bottom: -2.5cm;
                height: 2cm;
                margin: 0.25cm 0;
            }
            .overlay-bottom .content{
                position:absolute;
                bottom: 0;
            }

            .text-small {
                font-size: 0.7rem;
            }
            .text-smaller {
                font-size: 0.85rem;
            }
            .text-normal {
                font-size: 1rem;
            }
            .text-bigger {
                font-size: 1.3rem;
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
                /*Debug*/
                display: none;
                margin: 0 -1cm;
            }

            .overlay-top {
                left: 0;
                top: -10%;
            }
            .overlay-top .logo{
                width: 20%;
            }

            .overlay-bottom {
                left: 0;
                /*Debug*/
                /* bottom: -10%; */
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
        .mb-1 {
            margin-bottom: 6pt;
        }
        .mb-10 {
            margin-bottom: 1cm;
        }

        .text-right {
            text-align: right;
        }

        .text-justify {
            text-align: justify;
        }
        .text-center{
            text-align: center;
        }

        hr{
            border-color: rgb(216, 216, 216);
            height: 1px;
        }
        .capitalize{
            text-transform: uppercase;
        }
        .lh-1{
            line-height: 1;
        }
        .bl-1{
            border-left: 3px #222 solid;
            padding: 4px 10px;
            background-color: #f7f7f7;
        }
        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #dee2e6;
        }

        .table td,
        .table th {
            text-align:justify;
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6;
        }

        .table.table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .05);
        }

    </style>
</head>

<body>
    <div class="overlay overlay-top">
        <img src="https://offboarding.deprakoso.site/images/Logo%20Big.png" alt="Logo" class="logo" />
        @php
            $generator = new Picqer\Barcode\BarcodeGeneratorHTML();
        @endphp
        <div class="barcode">
            {!! $generator->getBarcode($documentID, $generator::TYPE_CODE_128) !!}
            <p>Document ID : {{$documentID}}</p>
        </div>
    </div>
    <div class="overlay overlay-bottom">
        <div class="text-small text-center">
            Jl. Medan Merdeka Barat No. 21, Jakarta 10110 | Indonesia Telp : (62-21) 3000 30001 | <a href="https://indosatooredoo.com">indosatooredoo.com</a href="http://www.">
        </div>
        <hr>
        <div class="text-small text-center">
            @yield('number_document') |
            {{-- Issued by : {{ $data->name }} - {{ date('Y-m-d H:i:s') }} | --}}
            {{-- @if (false)
            Approved by :
            {{ $data->name }} - {{ date('Y-m-d H:i:s') }}
            @else
            Waiting Approval
            @endif --}}
            {{-- Approved by : {{ $svp->name }} - {{ date('Y-m-d H:i:s') }} --}}
            Verified by : HRMGR - {{ date('Y-m-d H:i:s') }}
        </div>
    </div>
    @yield('container')
    @if (Route::is('pdfPreview'))
        @php
            $generator = new Picqer\Barcode\BarcodeGeneratorHTML();
        @endphp
        {!! $generator->getBarcode($documentID, $generator::TYPE_CODE_128) !!}
        <p>Product: {{$documentID}}</p>
        {!! json_encode($data) !!}
        {!! json_encode($offboarding) !!}
    @endif
    <br />
</body>

</html>

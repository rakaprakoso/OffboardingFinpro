<!doctype html>
<html lang="en">
@php
    $salary = 9000000;
@endphp
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="/images/Logo%20Big.png" type="image/x-icon" />
    {{-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> --}}
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.13.1/bootstrap-table.min.css">
    @if (Route::is('pdfPreview'))
        <link rel="stylesheet" href="{{ asset(mix('/css/app.css')) }}">
    @endif
    <title>Payroll - {{ $data->name }}</title>
    @if (Route::is('pdfGenerate'))
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
                /* border-spacing: 0; */
                /* width: 100%; */
                /* margin-bottom: 1rem; */
                border-collapse: collapse;
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
                width: 3.1cm;
                right: 0cm;
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
            }

            .overlay {
                position: fixed;
                display: none;
            }

        </style>
    @endif
    <style type="text/css">
        .detail,
        .list-data {
            color: #2c2c2c;
        }

        .header {
            background-color: #eab308;
            color: #FFF !important;
        }

        .header .pic {
            width: 100%;
            border-radius: 10px;
            object-fit: cover;
        }
        .header table {
            font-size:x-small;
        }

        .p-10 {
            padding: 40px;
        }

        .profile {
            padding-left: 1cm;
        }

        .profile h2,
        .profile h3 {
            margin: 0;
        }

        .profile h3 {
            margin-bottom: 0;
        }

        .profile table td {
            vertical-align: top;
        }

        .detail h3{
            font-size:10pt;
        }

        .logo {
            width: 100%;
        }

        .divider {
            background-color: #dee2e6;
            width: 100%;
            height: 1px;
        }
        th{
            text-align: left;
        }

        .table {
            /* border-spacing: 0; */
            /* width: 100%; */
            /* margin-bottom: 1rem; */
            background-color: transparent;
            border-collapse: collapse;
        }

        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #dee2e6;
        }

        .table td,
        .table th {
            text-align: justify;
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6;
        }

        .table.table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .05);
        }

        .text-center {
            text-align: center;
        }

        .inline-block {
            display: inline-block;
        }

        .w-half {
            width: 50%;
        }

    </style>
    @if (Route::is('pdfGenerate'))
        <style type="text/css">
            .header {
                background-color: #eab308;
                color: #FFF;
                margin: -2.5cm -2.5cm 0;
                padding: 1cm 2.5cm 1cm;
            }

            .header .pic {
                width: 100%;
                border-radius: 10px;
                object-fit: cover;
            }

        </style>
    @endif
</head>

<body>
    <div class="overlay overlay-top">
        <img src="https://tiptronic.deprakoso.site/images/Logo%20Big.png" alt="Logo" class="logo" />
    </div>
    <div class="overlay overlay-bottom">
        <div class="divider"></div>
        <div class="text-small">
            Note : Estimasi proses pembayaran adalah ± 14 hari setelah proses exit clearance selesai dilakukan
        </div>
    </div>
    <div class="header">
        <h3>PERHITUNGAN HAK DAN KEWAJIBAN</h3>
        <div class="divider"></div>
        <table width="100%">
            <tr>
                <td>
                    <table width="100%">
                        <tr>
                            <td>Nama</td>
                            <th>: {{ $data->name }}</th>
                        </tr>
                        <tr>
                            <td>NIK</td>
                            <th>: {{ $data->rawNIK }}</th>
                        </tr>
                        <tr>
                            <td>Position</td>
                            <th>: {{ $data->position }}</th>
                        </tr>
                        <tr>
                            <td>Sisa Hari Cuti</td>
                            <th>: 24 Hari</th>
                        </tr>
                    </table>
                </td>
                <td>
                    <table width="100%">
                        <tr>
                            <td>Tgl Mulai Kerja</td>
                            <th>: {{ $data->work_start_date }}</th>
                        </tr>
                        <tr>
                            <td>Tgl Berhenti</td>
                            <th>: {{ $offboarding->effective_date }}</th>
                        </tr>
                        <tr>
                            <td>Jumlah Masa Kerja</td>
                            <th>: 3 Tahun</th>
                        </tr>
                        <tr>
                            <td>Salary</td>
                            <th>: Rp. {{number_format($salary,0,",",".")}}</th>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <div class="detail">
        <h3>I. PERHITUNGAN HAK & KEWAJIBAN PERUSAHAAN</h3>
        <table class="table text-small" width="100%">
            <tr>
                <th colspan="3">A. HAK DARI PERUSAHAAN</th>
            </tr>
            <tr>
                <td colspan="2">Uang Kompensasi Akhir Kontrak PP 35/2021</td>
                <td>: Rp. {{number_format($salary,0,",",".")}}</td>
            </tr>
            <tr>
                <td colspan="2">Maksimal Jumlah Sisa Hari Cuti yang dapat Diuangkan <br>(18 Hari / 22 x Rp 9,403,730)</td>
                <td>: Rp. {{number_format(1000000,0,",",".")}}</td>
            </tr>
            <tr>
                <th colspan="2" style="text-align:right">Jumlah Hak (I.A)</th>
                <th>: Rp. {{number_format($salary+1000000,0,",",".")}}</th>
            </tr>
            <tr>
                <th colspan="3">B. KEWAJIBAN KEPADA PERUSAHAAN</th>
            </tr>
            <tr>
                <td colspan="2">Potongan Excess Medical</td>
                <td>: Rp. 7.000.000</td>
            </tr>
            <tr>
                <td colspan="2">Potongan Kelebihan HP Opers</td>
                <td>: Rp. 7.000.000</td>
            </tr>
            <tr>
                <th colspan="2" style="text-align:right">Jumlah Kewajiban (I.B)</th>
                <th>: Rp. 17.000.000</th>
            </tr>
            <tr>
                <th colspan="2" style="text-align:right">TOTAL HAK KARYAWAN SETELAH DIKURANGI KEWAJIBAN (I.A - I.B)</th>
                <th>: Rp. 17.000.000</th>
            </tr>
        </table>
        <div class="page-break"></div>
        <h3>II. PERHITUNGAN SIMPANAN & PINJAMAN KOPERASI</h3>
        <table class="table text-small" width="100%">
            <tr>
                <td colspan="2">Simpanan Koperasi</td>
                <td>: Rp. -</td>
            </tr>
            <tr>
                <td colspan="2">Kewajiban atas Pinjaman Koperasi</td>
                <td>: Rp. -</td>
            </tr>
            <tr>
                <th colspan="2" style="text-align:right">Jumlah Kewajiban</th>
                <th>: Rp. -</th>
            </tr>
        </table>
    </div>
    @if (Route::is('pdfPreview'))
        {!! json_encode($data) !!}
    @endif
    <br />
</body>

</html>

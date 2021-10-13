<!doctype html>
<html lang="en">

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
    <title>CV - {{ $data->name }}</title>
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
            color: #FFF!important;
        }

        .header .pic {
            width: 100%;
            border-radius: 10px;
            object-fit: cover;
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

        .logo {
            width: 100%;
        }

        .divider {
            background-color: #dee2e6;
            width: 100%;
            height: 1px;
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
            text-align:justify;
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6;
        }

        .table.table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .05);
        }

    </style>
    @if (Route::is('pdfGenerate'))
        <style type="text/css">
            .header {
                background-color: #eab308;
                color: #FFF;
                margin: -2.5cm -2.5cm 0;
                padding: 2cm 2.5cm 1cm;
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
            Print Date : {{ date('d F Y') }}
        </div>
    </div>
    <div class="header">
        <table class="" width=" 100%">
            <tr>
                <td align="center" style="width: 30%;">
                    <img src="https://image.kpopmap.com/2020/11/More__More_Dahyun_Promo_2.jpg" alt="Logo"
                        {{-- width="100" height="100" --}} class="pic" />
                </td>
                <td align="left" class="profile" style="width: 70%;">
                    <h2>Employee Data</h2>
                    <h3>{{ $data->name }}</h3>
                    <table width="100%">
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
                        <tr>
                            <td>Location</td>
                            <td>: {Jakarta}</td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </div>
    <div class="detail">
        <h3>Profile</h3>
        <table class="table text-small" width="100%">
            <tr>
                <td>Birthplace/Birthdate</td>
                <td>: {{ $data->birth_date }}</td>
            </tr>
            <tr>
                <td>Gender</td>
                <td>: {{ $data->position }}</td>
            </tr>
            <tr>
                <td>Religion</td>
                <td>: {Islam}</td>
            </tr>
            <tr>
                <td>Date of Start Work</td>
                <td>: {{ $data->work_start_date }}</td>
            </tr>
            <tr>
                <td>Employee Status</td>
                <td>: {Berhenti tnp Pensiun Tanpa Hak Pensiun}</td>
            </tr>
            <tr>
                <td>Marital Status</td>
                <td>: {Married }</td>
            </tr>
            <tr>
                <td>Home Address</td>
                <td>: {Jl. A. Djelani RT.034 RW.007 - Kel. Terusan, Kec. Mempawah Hilir - Mempawah 78912}</td>
            </tr>
            <tr>
                <td>Telephone Number </td>
                <td>: {{ $data->phone }}</td>
            </tr>
        </table>
    </div>
    <div class="page-break"></div>
    <div class="list-data">
        <h3>Formal Education</h3>
        <div class="divider"></div>
        <table class="text-small table table-striped" width="100%">
            <thead>
                <tr>
                    <th>Institute</th>
                    <th>Branch of Study</th>
                    <th>Year Graduation</th>
                    <th>Educational Esthablishment</th>
                </tr>
            </thead>
            <tr>
                <td>President University</td>
                <td>Information Systems</td>
                <td>2021</td>
                <td>S1</td>
            </tr>
        </table>
    </div>
    <div class="list-data">
        <h3>Non Formal Education</h3>
        <div class="divider"></div>
        <table class="text-small table table-striped" width="100%">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Course Name</th>
                    <th>Location</th>
                    <th>Date</th>
                </tr>
            </thead>
            @for ($i = 1; $i <= 20; $i++)
            <tr>
                <td>{{$i}}</td>
                <td>Talk Like a Winner</td>
                <td>Vara Percinka</td>
                <td>2020</td>
            </tr>
            @endfor
        </table>
    </div>
    <div class="list-data">
        <h3>Work History</h3>
        <div class="divider"></div>
        <table class="text-small table table-striped" width="100%">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Work Unit</th>
                    <th>Location</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tr>
                <td>Staff-GTM & Marcomm</td>
                <td>Dept. GTM & Marcomm Area - Div. Regional
                    GTM & Trade Marketing - Region Kalimantan
                    & Sumapa - Office of Chief Commercial -
                    Office of Pres. Dir & Chief Executive</td>
                <td>Sampit</td>
                <td>01.07.2020</td>
            </tr>
        </table>
    </div>
    <div class="list-data">
        <h3>Achievements</h3>
        <div class="divider"></div>
        <table class="text-small table table-striped" width="100%">
            <thead>
                <tr>
                    <th>Award Name</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tr>
                <td>Staff-GTM & Marcomm</td>
                <td>01.07.2020</td>
            </tr>
        </table>
    </div>
    @if (Route::is('pdfPreview'))
        {!! json_encode($data) !!}
    @endif
    <br />
</body>

</html>

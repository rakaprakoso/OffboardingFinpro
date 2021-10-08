<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="/images/Logo%20Big.png" type="image/x-icon" />
    @if (Request::is('admin/cvPreview'))
        <link rel="stylesheet" href="{{ asset(mix('/css/app.css')) }}">
    @endif

    <title>CV - {{ $data->name }}</title>
    @if (Request::is('admin/cvGenerate'))
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
                margin: 0px;
            }

            body {
                background: #ffffff;
                margin: 0px;
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

            .text-small {
                font-size: x-small;
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

        .profile h3 {
            margin-bottom: 0;
        }

        .profile table td {
            vertical-align: top;
        }

        .logo {
            width: 100%;
        }

        .overlay {
            position: fixed;
        }

        .overlay-top {
            width: 100px;
            right: 10px;
            top: 10px;
        }

        .overlay-bottom {
            /* width: 100%;
            bottom: 10px;
            width: 100px; */
            left: 10px;
            top: 100%;
            margin-top: -5%;
            /* bottom: 10px; */
        }

        .overlay-bottom p {
            text-align: left;
            font-size: small;
        }

    </style>
</head>

<body>
    <div class="overlay overlay-top">
        <img src="https://tiptronic.deprakoso.site/images/Logo%20Big.png" alt="Logo" class="logo" />
    </div>
    <div class="overlay overlay-bottom">
        <p>Approved : Raka D P | {{ date('Y-m-d H:i:s') }}</p>
    </div>
    <div class="information">
        <table class="p-10" width="100%">
            <tr>
                <td align="center" style="width: 40%;">
                    <img src="https://image.kpopmap.com/2020/11/More__More_Dahyun_Promo_2.jpg" alt="Logo"
                        {{-- width="100" height="100" --}} class="pic" />
                </td>
                <td align="left" class="profile" style="width: 60%;">
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
    <div class="detail p-10">
        <h3>Profile</h3>
        <hr />
        <table class="text-small" width="100%">
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
    <div class="work-history p-10">
        <h3>Work History</h3>
        <hr />
        <table class="text-small" width="100%" border="1">
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
    @if (Request::is('admin/cvPreview'))
        {!! json_encode($data) !!}
    @endif
    <br />
</body>

</html>

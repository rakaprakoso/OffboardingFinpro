<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#2a3f2b"/>
    <link rel="stylesheet" href="{{asset(mix('/css/app.css'))}}">
    <link rel="stylesheet" href="{{asset(mix('/css/appClient.css'))}}">
    <link rel="stylesheet" href="{{asset(mix('/css/appAdmin.css'))}}">
    {!! SEO::generate() !!}
</head>
<body>
    <div id="root">
    </div>

    <script defer src="{{asset(mix('/js/admin/app.js'))}}"></script>
    {{-- <script defer src="{{ asset('js/app.js') }}"></script> --}}
</body>
</html>

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;
use Dompdf\Dompdf;
use App\Models\Employee;

class AdminController extends Controller
{
    public function cvGenerate(Request $request)
    {

        // $pdf = \App::make('dompdf.wrapper');
        // $pdf->loadHTML('<h1>Test</h1>');
        // return $pdf->stream();

        // $dompdf = \App::make('dompdf.wrapper');
        // $dompdf->loadHTML('<h1>Test</h1>');
        // return $dompdf->stream();

        // $pdf = \PDF::loadView('PDF.CV', $data);
        $data['data'] = Employee::find(1);
        // return $data;
        $pdf = \PDF::loadView('PDF.CV',$data);
        $pdf->save('storage/Documents/CV/'.$data['data']->name.'.pdf');
        return redirect('/storage/Documents/CV/'.$data['data']->name.'.pdf');
        // return $pdf->stream();
        // return $pdf->download('invoice.pdf');
    }
    public function cvPreview(Request $request)
    {
        // $pdf = \PDF::loadView('PDF.CV');
        $data = Employee::find(1);
        return view('PDF.CV')
        ->with('data',$data);
    }
}

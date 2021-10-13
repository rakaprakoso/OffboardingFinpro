<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Traits\PDFTrait;

class AdminController extends Controller
{
    use PDFTrait;
    public function pdfStore(Request $request)
    {
        $input = array(
            'employeeID' => 1,
            'type' => 1,
           'offboardingID'=>26,
        );
        return $this->generatePDF($input);
    }
    public function pdfGenerate(Request $request)
    {

        // $pdf = \App::make('dompdf.wrapper');
        // $pdf->loadHTML('<h1>Test</h1>');
        // return $pdf->stream();

        // $dompdf = \App::make('dompdf.wrapper');
        // $dompdf->loadHTML('<h1>Test</h1>');
        // return $dompdf->stream();

        // $pdf = \PDF::loadView('PDF.CV', $data);
        $type = $request->type ? $request->type : 1;
        $input = array(
            'employeeID' => 1,
            'type' => $type,
            'offboardingID'=>26,
        );
        return $this->generatePDF($input, true);
        // $data['data'] = Employee::find(1);
        // // return $data;
        // $pdf = \PDF::loadView('PDF.CV',$data);
        // $pdf->save('storage/Documents/CV/'.$data['data']->name.'.pdf');
        // return redirect('/storage/Documents/CV/'.$data['data']->name.'.pdf');

        // return $pdf->stream();
        // return $pdf->download('invoice.pdf');
    }
    public function pdfPreview(Request $request)
    {
        $type = $request->type ? $request->type : 1;
        $input = array(
            'employeeID' => 1,
            'type' => $type,
            'offboardingID'=>26,
        );
        return $this->previewPDF($input);
        // $pdf = \PDF::loadView('PDF.CV');
        // $data = Employee::find(1);
        // return view('PDF.CV')
        // ->with('data',$data);
    }
}

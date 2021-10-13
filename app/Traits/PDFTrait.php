<?php

namespace App\Traits;
use App\Models\Employee;
use App\Models\Offboarding;

trait PDFTrait
{
    public function generatePDF($rawData=null, $temp=null)
    {
        $id = $rawData['employeeID'];
        $type = $rawData['type'];

        $data['offboarding'] = Offboarding::find($rawData['offboardingID']);
        if ($type=='1') {
            $data['data'] = $data['offboarding']->employee;
        }else{
            $data['data'] = Employee::find($id);
        }

        $data['generate'] = '1';
        $pdf = \PDF::loadView($this->typeDocument($type)['view'], $data);
        if ($temp) {
            return $pdf->stream();
        }else{
            //Save File to Server
            $path = $this->typeDocument($type)['dir'].$data['data']->name.'-'.time().'.pdf';
            $pdf->save($path);
            //Save to DB
            $data['offboarding']->details->resignation_letter_link = config('app.url').'/'.$path;
            $data['offboarding']->push();

            return response()->json('CV Created Successfully');
            return redirect('/'.$path);
        }
    }
    public function previewPDF($rawData=null, $temp=null)
    {
        $id = $rawData['employeeID'];
        $type = $rawData['type'];
        $offboarding = Offboarding::with('details')->find($rawData['offboardingID']);
        if ($type=='1' || $type=='3') {
            $data = $offboarding->employee;
        }else{
            $data = Employee::find($id);
        }
        return view($this->typeDocument($type)['view'])
            ->with('data', $data)
            ->with('offboarding', $offboarding)
            ;
    }

    private function typeDocument($type){
        $defaultView = 'PDF.';
        $defaultFolder = 'storage/Documents/';
        $view = null;
        $dir = null;
        switch ($type) {
            case '1': #ResignLetter
                $view = 'ResignationLetter';
                $dir = 'Resign Letter';
                break;
            case '2': #CV
                $view = 'CV';
                $dir = 'CV';
                break;
            case '3': #Payroll
                $view = 'Payroll';
                $dir = 'Payroll';
                break;
            default:
                break;
        }
        $data['view'] =$defaultView.$view;
        $data['dir'] = $defaultFolder.$dir.'/';
        // return $defaultView.$view;
        return $data;
    }
}

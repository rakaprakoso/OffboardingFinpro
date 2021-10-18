<?php

namespace App\Traits;

use App\Models\Employee;
use App\Models\Offboarding;

trait PDFTrait
{
    public function generatePDF($rawData = null, $temp = null)
    {
        ##employeeID,offboardingID,type
        $id = $rawData['employeeID'];
        $type = $rawData['type'];

        $data['offboarding'] = Offboarding::with('employee', 'exitClearance')->find($rawData['offboardingID']);
        $data['data'] = $data['offboarding']->employee;
        if ($type == '2') {
            $data['data'] = Employee::with('formal_education', 'non_formal_education', 'job_history', 'achievements')->find($data['offboarding']->employee_id);
        } elseif ($type == '3') {
            $data['payroll'] = $this->exitPayroll($data['offboarding']);
        }

        $data['generate'] = '1';
        $pdf = \PDF::loadView($this->typeDocument($type)['view'], $data);
        if ($temp) {
            return $pdf->stream();
        } else {
            //Save File to Server
            $path = $this->typeDocument($type)['dir'] . $data['data']->name . '-' . time() . '.pdf';
            $pdf->save($path);

            //Save to DB
            switch ($type) {
                case '1':
                    $data['offboarding']->attachment->resignation_letter_link = config('app.url') . '/' . $path;
                    break;
                case '2':
                    $data['offboarding']->attachment->cv_link = config('app.url') . '/' . $path;
                    break;
                case '3':
                    $data['offboarding']->attachment->payroll_link = config('app.url') . '/' . $path;
                    break;
                default:
                    # code...
                    break;
            }
            $data['offboarding']->push();

            return response()->json('CV Created Successfully');
            return redirect('/' . $path);
        }
    }
    public function previewPDF($rawData = null, $temp = null)
    {
        $id = $rawData['employeeID'];
        $type = $rawData['type'];
        $offboarding = Offboarding::with('details')->find($rawData['offboardingID']);
        if ($type == '1' || $type == '3') {
            $data = $offboarding->employee;
        } else {
            $data = Employee::find($id);
        }
        return view($this->typeDocument($type)['view'])
            ->with('data', $data)
            ->with('offboarding', $offboarding);
    }

    private function typeDocument($type)
    {
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
        $data['view'] = $defaultView . $view;
        $data['dir'] = $defaultFolder . $dir . '/';
        // return $defaultView.$view;
        return $data;
    }
    private function exitPayroll($rawData)
    {
        $data['salary'] = $rawData->employee->salary;
        $data['paid_leave_available'] = $rawData->employee->paid_leave_available;

        ##Work Duration
        $effective_date = \Carbon\Carbon::createFromFormat('Y-m-d', $rawData->effective_date);
        $hire_date = \Carbon\Carbon::createFromFormat('Y-m-d', $rawData->employee->hire_date);
        $data['work_duration'] = $effective_date->diffInYears($hire_date);

        $difference = $hire_date->diff($effective_date);
        $data['work_duration_text'] = $difference->y .' Tahun ' . $difference->m . ' Bulan ' . $difference->d . ' Hari';
        // echo 'Difference: ' . $difference->y . ' years, '
        //     . $difference->m . ' months, '
        //     . $difference->d . ' days';

        ##Severance pay
        if ($data['work_duration'] < 8) {
            $data['severance_pay'] = ($data['work_duration']+1) * $data['salary'];
        } else {
            $data['severance_pay'] = 9 * $data['salary'];
        }
        ##Uang penghargaan masa kerja (UPMK)
        if ($data['work_duration'] / 3 < 8 && $data['work_duration'] >= 3) {
            $data['upmk_pay'] = ceil($data['work_duration'] / 3) * $data['salary'];
        } elseif ($data['work_duration'] / 3 > 8) {
            $data['upmk_pay'] = 10 * $data['salary'];
        }
        ##Uang Cuti
        $data['paid_leave_pay'] = ($data['paid_leave_available'] / 25) * $data['salary'];

        $data['rights_total'] =  $data['severance_pay'] + $data['upmk_pay'] + $data['paid_leave_pay'];


        $data['excess_medical'] =  $rawData->exitClearance->medical[0]['Ekses Medical'];
        $data['kelebihan_opers'] =  $rawData->exitClearance->fastel[0]['Outstanding'];
        $data['obligations_total'] =  $data['excess_medical'] + $data['kelebihan_opers'];

        $data['net_total'] =  $data['rights_total'] - $data['obligations_total'];

        ##Koperasi
        $data['rights_kopindosat'] =  $rawData->exitClearance->kopindosat[0]['Hak'];
        $data['obligations_kopindosat'] =  $rawData->exitClearance->kopindosat[0]['Kewajiban'];
        $data['total_kopindosat'] = $data['rights_kopindosat'] - $data['obligations_kopindosat'];

        return $data;
    }
}

<?php

namespace App\Traits;

use App\Mail\DocumentExitRequest;
use App\Mail\EmployeeClearDocument;
use App\Mail\ResignationRequest;
use App\Models\Employee;
use App\Models\Offboarding;
use App\Models\OffboardingDetail;
use App\Models\OffboardingCheckpoint;
use App\Models\ExitClearance;
use App\Models\OffboardingAttachment;
use App\Models\OffboardingConfig;
use App\Models\OffboardingForm;
use App\Models\OffboardingInputToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

trait OffboardingTrait
{
    public function newOffboarding($request, $employeeID)
    {
        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $employeeID;
        $offboardingTicket->effective_date = $request->effective_date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->employee_token = Str::random(64);
        $offboardingTicket->status_id = "0";

        if ($request->admin != "true") {
            $offboardingTicket->type_id = "e202";
        } else {
            $offboardingTicket->type_id = $request->type;
        }

        if ($offboardingTicket->type_id != "e202" && $offboardingTicket->type_id != "e201") {
            $offboardingTicket->status_id = "3";
        }

        $offboardingTicket->save();

        $offboardingDetail = new OffboardingDetail;
        $offboardingDetail->offboarding_id = $offboardingTicket->id;
        $offboardingDetail->reason = $request->reason;
        // if ($request->file('resign_letter')) {
        //     $file = $request->file('resign_letter');
        //     $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
        //     $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();
        //     $path = Storage::putFileAs(
        //         'public/Documents/Resign Letter',
        //         $request->file('resign_letter'),
        //         $fileName
        //     );
        //     $offboardingDetail->resignation_letter_link = config('app.url') . Storage::url($path);
        // }
        $offboardingTicket->details()->save($offboardingDetail);

        $checkpoint = new OffboardingCheckpoint();
        if ($offboardingTicket->type_id != "e202" && $offboardingTicket->type_id != "e201") {
            $checkpoint->acc_employee = true;
            $checkpoint->acc_svp = true;
            $checkpoint->exit_interview = true;
        }

        $offboardingTicket->checkpoint()->save($checkpoint);
        $exitClearance = new ExitClearance();
        $offboardingTicket->exitClearance()->save($exitClearance);
        $offboardingForm = new OffboardingForm();
        $offboardingTicket->offboardingForm()->save($offboardingForm);
        $offboardingAttachment = new OffboardingAttachment();
        $offboardingTicket->attachment()->save($offboardingAttachment);
        $offboardingToken = new OffboardingInputToken();
        $offboardingTicket->inputToken()->save($offboardingToken);

        $this->generateToken($offboardingTicket);
        if ($offboardingTicket->type_id != "e202" && $offboardingTicket->type_id != "e201") {
            $this->requestExitDocument($offboardingTicket, false, $request,false);
        }
        return $offboardingTicket;
    }
    public function generateToken($offboardingTicket)
    {
        ##DOCUMENT EXIT REQUEST
        $offboardingTicket->inputToken->hrss_doc = random_int(100000, 999999);
        $offboardingTicket->inputToken->it = random_int(100000, 999999);
        $offboardingTicket->inputToken->finance = random_int(100000, 999999);
        $offboardingTicket->inputToken->kopindosat = random_int(100000, 999999);
        $offboardingTicket->inputToken->hrdev = random_int(100000, 999999);
        $offboardingTicket->inputToken->fastel = random_int(100000, 999999);
        $offboardingTicket->inputToken->medical = random_int(100000, 999999);
        $offboardingTicket->inputToken->svp = random_int(100000, 999999);
        $offboardingTicket->inputToken->hrss_it = random_int(100000, 999999);
        $offboardingTicket->push();
    }

    public function employeeConfirmation($request, $offboardingTicket)
    {
        $offboardingTicket->checkpoint->acc_employee = $request->status == '1' ? true : false;
        $offboardingTicket->push();
        $offboardingTicket->save();
        if ($offboardingTicket->checkpoint->acc_employee == false) {
            if ($offboardingTicket->status_id != "-3") {
                $offboardingTicket->status_id = "-3";
                if ($offboardingTicket->save()) {
                    $this->addProgressRecord(
                        $request->offboardingID,
                        true,
                        false,
                        "Employee Cancel Offboarding",
                    );
                }
                try {
                    Mail::to('offboarding.indosat@getnada.com')->send(new ResignationRequest($offboardingTicket, -3, 'info'));
                } catch (\Throwable $th) {
                    $this->addProgressRecord(
                        $offboardingTicket->id,
                        false,
                        false,
                        "Email Not Sent - " . $th,
                    );
                }
            }
        } else {
            $offboarding = Offboarding::with('Employee', 'Details')->find($offboardingTicket->id);
            $manager_id = Employee::find($offboardingTicket->employee->manager_id)->email;
            try {
                Mail::to(['manager.indosat@getnada.com', $manager_id])->send(new ResignationRequest($offboarding));
            } catch (\Throwable $th) {
                $this->addProgressRecord(
                    $offboardingTicket->id,
                    false,
                    false,
                    "Email Not Sent - " . $th,
                );
            }
        }
    }

    public function lineManagerApproval($offboardingTicket, $request, $dateChanged)
    {
        $offboardingTicket->checkpoint->acc_svp = $request->status == '1' ? true : false;
        $offboardingTicket->effective_date = $request->effective_date;
        $offboardingTicket->push();
        $offboardingTicket->save();
        if ($offboardingTicket->checkpoint->acc_svp == true) {
            $this->updateProgress($offboardingTicket);
            if (
                $offboardingTicket->save()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Line Manager Approved Offboarding",
                );
            }
            $this->requestExitDocument($offboardingTicket, $dateChanged, $request);
        } elseif ($offboardingTicket->checkpoint->acc_svp == false && $offboardingTicket->status_id != "-2") {
            try {
                Mail::to($offboardingTicket->employee->email)->send(new ResignationRequest($offboardingTicket, -2, 'info'));
            } catch (\Throwable $th) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    false,
                    false,
                    "Email not sent " . $th,
                );
            }
            $offboardingTicket->status_id = "-2";
            if (
                $offboardingTicket->save()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Line Manager Not Approved Offboarding",
                );
            }
        }
    }

    private function requestExitDocument($offboardingTicket, $dateChanged = false, $request, $needLineManagerApproval = true)
    {
        if ($needLineManagerApproval) {
            if (str_contains($offboardingTicket->type_id, 'e20')) {
                $input = array(
                    'processTypeIn' => 2,
                    'offboardingIDIn' => $offboardingTicket->id,
                );
                $input = json_encode($input);
                $this->startProcess($input);
                try {
                    if ($dateChanged) {
                        Mail::to($offboardingTicket->employee->email)
                            ->send(new ResignationRequest($offboardingTicket, 3, 'info'));
                    } else {
                        Mail::to($offboardingTicket->employee->email)
                            ->send(new ResignationRequest($offboardingTicket, 4, 'info'));
                    }
                } catch (\Throwable $th) {
                    $this->addProgressRecord(
                        $request->offboardingID,
                        false,
                        false,
                        "Fail Send Email To Employee",
                    );
                }
            }
        }
        $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
        for ($i = 1; $i <= 6; $i++) {
            $inputToken = '';
            switch ($i) {
                case '1':
                    $inputToken = $offboardingTicket->inputToken->it;
                    break;
                case '2':
                    $inputToken = $offboardingTicket->inputToken->finance;
                    break;
                case '3':
                    $inputToken = $offboardingTicket->inputToken->kopindosat;
                    break;
                case '4':
                    $inputToken = $offboardingTicket->inputToken->hrdev;
                    break;
                case '5':
                    $inputToken = $offboardingTicket->inputToken->fastel;
                    break;
                case '6':
                    $inputToken = $offboardingTicket->inputToken->medical;
                    break;
            }

            try {
                Mail::to($emailList[$i]['value'])->send(new DocumentExitRequest($offboardingTicket, 1, $inputToken));
            } catch (\Throwable $th) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    false,
                    false,
                    "Fail Send Email To " . $emailList[$i]['value'],
                );
            }
        }
        $this->updateProgress($offboardingTicket, 3);
        if (
            $offboardingTicket->save()
        ) {
            $this->addProgressRecord(
                $request->offboardingID,
                true,
                false,
                "Doc Exit Requested",
            );
        }
    }

    public function fillExitInterviewForm($offboardingTicket, $rawData, $request)
    {
        $data['other_activity'] = isset($rawData['data']->otherActivity) ? $rawData['data']->otherActivity : '-';
        $offboardingTicket->offboardingForm->exit_interview_form = $data;
        if ($offboardingTicket->push()) {
            $this->addProgressRecord(
                $request->offboardingID,
                true,
                false,
                "Employees Fill Exit Interview Form",
            );
        }
        try {
            $manager_id = Employee::find($offboardingTicket->employee->manager_id)->email;
            Mail::to(['manager.indosat@getnada.com', $manager_id])->send(new EmployeeClearDocument($offboardingTicket));
        } catch (\Throwable $th) {
            $this->addProgressRecord(
                $request->offboardingID,
                false,
                false,
                "Email not Sent",
            );
        }
        $offboardingTicket->checkpoint->exit_interview = 2;
        $offboardingTicket->push();
    }
    public function updateProgress($offboardingTicket, $process = 0)
    {
        if (
            $process == 3
        ) {
            $offboardingTicket->checkpoint->confirm_fastel = 2;
            $offboardingTicket->checkpoint->confirm_kopindosat = 2;
            $offboardingTicket->checkpoint->confirm_it = 2;
            $offboardingTicket->checkpoint->confirm_hrdev = 2;
            $offboardingTicket->checkpoint->confirm_medical = 2;
            $offboardingTicket->checkpoint->confirm_finance = 2;
            $offboardingTicket->push();
        }
        if ($process == 7 && $offboardingTicket->status_id == '6') {
            $offboardingTicket->status_id = "7";
            $this->offboardingDone($offboardingTicket);
            $offboardingTicket->save();
            return true;
        }

        if (
            $offboardingTicket->checkpoint->acc_employee == 1
        ) {
            $offboardingTicket->status_id = "1";
            $offboardingTicket->save();
        }
        if (
            $offboardingTicket->checkpoint->acc_svp == 1
        ) {
            $offboardingTicket->status_id = "2";
            $offboardingTicket->save();
        }
        if (
            $process == 3 || $offboardingTicket->status_id == "2"
        ) {
            $offboardingTicket->status_id = "3";
            $offboardingTicket->save();
        }
        if (
            $offboardingTicket->status_id == "3" &&
            $offboardingTicket->checkpoint->confirm_fastel == 1 &&
            $offboardingTicket->checkpoint->confirm_kopindosat == 1 &&
            $offboardingTicket->checkpoint->confirm_it == 1 &&
            $offboardingTicket->checkpoint->confirm_hrdev == 1 &&
            $offboardingTicket->checkpoint->confirm_medical == 1 &&
            $offboardingTicket->checkpoint->confirm_finance == 1
        ) {
            $offboardingTicket->status_id = "4";
            $offboardingTicket->save();
        }
        if (
            $offboardingTicket->status_id == "4" &&
            $offboardingTicket->checkpoint->employee_return_document == 1
        ) {
            $offboardingTicket->status_id = "5";
            $offboardingTicket->save();
        }
        if (
            $offboardingTicket->status_id == "5" &&
            $offboardingTicket->checkpoint->return_to_svp == 1 &&
            $offboardingTicket->checkpoint->return_to_hrss_doc == 1 &&
            $offboardingTicket->checkpoint->return_to_hrss_it == 1 &&
            $offboardingTicket->checkpoint->exit_interview == 1
        ) {
            $offboardingTicket->status_id = "6";
            $offboardingTicket->save();
            try {
                ##APPROVAL HR MGR
                $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
                Mail::to(["hrmgr@getnada.com", $emailList[8]['value']])->send(new DocumentExitRequest($offboardingTicket, 2));
                $offboardingTicket->checkpoint->acc_hrbp_mgr = 2;
                $offboardingTicket->push();
            } catch (\Throwable $th) {
                //throw $th;
            }
        }
        if ($process == 7 && $offboardingTicket->status_id == '6') {
            $offboardingTicket->status_id = "7";
            $this->offboardingDone($offboardingTicket);
            $offboardingTicket->save();
            return response()->json('Success');
        }

        // if ($process == 4 && $offboardingTicket->status_id != '5') {
        //     if (
        //         $offboardingTicket->checkpoint->confirm_fastel == true &&
        //         $offboardingTicket->checkpoint->confirm_kopindosat == true &&
        //         $offboardingTicket->checkpoint->confirm_it == true &&
        //         $offboardingTicket->checkpoint->confirm_hrdev == true &&
        //         $offboardingTicket->checkpoint->confirm_medical == true &&
        //         $offboardingTicket->checkpoint->confirm_finance == true
        //         // &&
        //         // $offboardingTicket->checkpoint->confirm_payroll == true
        //     ) {
        //         $offboardingTicket->status_id = "4";
        //         $offboardingTicket->save();
        //         if (
        //             $offboardingTicket->checkpoint->employee_return_document == true
        //         ) {
        //             $offboardingTicket->status_id = "5";
        //             $offboardingTicket->save();
        //         }
        //     }

        //     if (
        //         $offboardingTicket->checkpoint->return_to_svp == true &&
        //         $offboardingTicket->checkpoint->return_to_hrss_doc == true &&
        //         $offboardingTicket->checkpoint->return_to_hrss_it &&
        //         $offboardingTicket->status_id == '5'
        //     ) {
        //         $offboardingTicket->status_id = "6";
        //         $offboardingTicket->save();
        //         ##APPROVAL HR MGR
        //         $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
        //         Mail::to(["hrmgr@getnada.com", $emailList[8]['value']])->send(new DocumentExitRequest($offboardingTicket, 2));
        //     }
        // }
        // // if ($process == 4 && $offboardingTicket->checkpoint->confirm_payroll == true && $offboardingTicket->status_id == '5') {
        // //     $offboardingTicket->status_id = "6";
        // //     $offboardingTicket->save();
        // // }
        // if ($process == 5 && $offboardingTicket->status_id == '4') {
        //     $offboardingTicket->status_id = "5";
        //     $offboardingTicket->save();
        // }

    }
}

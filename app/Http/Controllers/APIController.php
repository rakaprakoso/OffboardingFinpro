<?php

namespace App\Http\Controllers;

use App\Mail\DocumentExitRequest;
use App\Mail\EmployeeClearDocument;
use App\Models\Offboarding;
use App\Models\OffboardingDetail;
use App\Models\Employee;
use App\Models\OffboardingCheckpoint;
use App\Models\ExitClearance;
use App\Models\RightObligation;
use App\Models\StatusDetail;
use App\Models\TypeDetail;
use App\Models\ProgressRecord;
use App\Traits\PDFTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use File;
use DB;
use App\Mail\ResignationRequest;
use App\Models\Comment;
use App\Models\OffboardingAttachment;
use App\Models\OffboardingConfig;
use App\Models\OffboardingForm;
use Illuminate\Support\Facades\Mail;

use function PHPUnit\Framework\isEmpty;

class APIController extends Controller
{
    use PDFTrait;
    private function getAccessToken()
    {
        $url = 'https://account.uipath.com/oauth/token';

        $ch = curl_init($url);
        $data = array(
            'grant_type' => 'refresh_token',
            'client_id' => '8DEv1AMNXczW3y4U15LL3jYf62jK93n5',
            'refresh_token' => 'dBmG0jkGJjTHWvV5ohcykT7a9WBrvTk3ONMnmiVxU0b2J'
        );
        $payload = json_encode($data);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json', 'X-UIPATH-TenantName: Indosat'));

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_TIMEOUT,60);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $result = curl_exec($ch);
        echo $result;
        curl_close($ch);

        $obj = json_decode($result);
        return $obj->access_token;
    }
    private function startProcess($argumentIn)
    {
        $auth = $this->getAccessToken();

        $url = 'https://platform.uipath.com/presiaykbmhx/Indosat/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs';

        $ch = curl_init($url);
        $data = array(
            // 'ReleaseKey' => '842a7024-05c7-4856-8da7-e6a8814692c9',
            'ReleaseKey' => 'cb0907ba-a09f-46b8-8298-6d1fc1ca63f0',
            'Strategy' => 'ModernJobsCount',
            "RuntimeType" => "Development",
            "RobotIds" => [],
            "NoOfRobots" => 0,
            "JobsCount" => 1,
            'InputArguments' => $argumentIn,
        );
        $payload = json_encode(array("startInfo" => $data));

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json', 'Content-Type: application/json',
            'X-UIPATH-TenantName: INDOSAT', 'Authorization: Bearer ' . $auth, 'User-Agent: telnet',
            'X-UIPATH-OrganizationUnitId: 2257654',
        ));

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $result = curl_exec($ch);
        echo $result;
        curl_close($ch);

        $obj = json_decode($result);
    }

    public function postResignForm(Request $request)
    {
        $employeeID = $request->employeeIDIn;

        $processOffboarding = Offboarding::where('employee_id', $employeeID)->whereBetween('status_id', [0, 6])->get()->count();
        if ($processOffboarding > 0) {
            return response()->json('Fail', 400);
        }

        if ($request->admin != "true") {
            $this->validate($request, [
                // 'employeeIDIn' => 'required|exists:employees,id',
                // 'resign_letter' => 'required|file|max:7000',
            ]);
            $employee = Employee::where('id', $employeeID)->orWhere('nik', $employeeID)
                ->where('password', $request->password)->first();
            if (!$employee) {
                return response()->json('Fail', 400);
            } else {
                $employeeID = $employee->id;
            }
            // return response()->json($employee);
        } elseif ($request->adminPublic == "true") {
            $svp = Employee::where('id', $request->svpID)->where('password', $request->svpPassword)->first();
            $employee = Employee::where('manager_id', $request->svpID)->where('id', $request->employeeID)->first();
            if (!$svp || !$employee) {
                return response()->json('Fail', 400);
            }

            $processOffboarding = Offboarding::where('employee_id', $request->employeeID)->whereBetween('status_id', [0, 6])->get()->count();
            if ($processOffboarding > 0) {
                return response()->json('Fail', 400);
            }

            $employeeID = $request->employeeID;
        } else {
            $employeeID = $request->employeeID;
        }

        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $employeeID;
        $offboardingTicket->effective_date = $request->effective_date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->employee_token = Str::random(64);
        $offboardingTicket->status_id = "1";

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
        // $checkpoint->acc_document = true;
        $checkpoint->acc_employee = true;
        if ($offboardingTicket->type_id != "e202" && $offboardingTicket->type_id != "e201") {
            $checkpoint->acc_svp = true;
        }

        $offboardingTicket->checkpoint()->save($checkpoint);

        $exitClearance = new ExitClearance();
        $offboardingTicket->exitClearance()->save($exitClearance);

        $offboardingForm = new OffboardingForm();
        $offboardingTicket->offboardingForm()->save($offboardingForm);

        $offboardingAttachment = new OffboardingAttachment();
        $offboardingTicket->attachment()->save($offboardingAttachment);

        // $rightObligation = new RightObligation();
        // $offboardingTicket->rightObligation()->save($rightObligation);

        $processType = 1;
        if ($offboardingTicket->type_id != "e202") {
            $processType = 2;
        }

        $this->addProgressRecord(
            $offboardingTicket->id,
            true,
            false,
            "Offboarding Ticket Created",
        );

        ##Send Email to SVP and Employee
        if ($offboardingTicket->type_id == "e202") {
            $offboarding = Offboarding::with('Employee', 'Details')->find($offboardingTicket->id);
            $svp = Employee::find($offboarding->employee->department->hr_svp_id)->email;
            Mail::to(['svp@getnada.com',$svp])->send(new ResignationRequest($offboarding));
            Mail::to($offboarding->employee->email)->send(new ResignationRequest($offboarding, 2));
        }
        // $input = json_encode($input);
        // $this->startProcess($input);
        return response()->json("Success", 200);
    }

    public function postEmployeeReject(Request $request)
    {
        return response()->json($request->id);
    }
    public function postVerifyResignLetter($id, Request $request)
    {
    }

    public function postManagerConfirmation(Request $request)
    {
        $dateChanged = "0";
        $offboardingTicket = Offboarding::find($request->offboardingID);
        if ($offboardingTicket->effective_date != $request->effective_date) {
            $dateChanged = "1";
        }
        if ($request->employee == '1') {
            $offboardingTicket->checkpoint->acc_employee = $request->status == '1' ? true : false;
        } elseif ($request->hrmgr == '1') {
            $offboardingTicket->checkpoint->acc_hrbp_mgr = $request->status == '1' ? true : false;
            $offboardingTicket->status_id = 7;
            $offboardingTicket->push();
            if (
                $offboardingTicket->save()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "HR Manager Confirmed Offboarding",
                );
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Offboarding Completed",
                );
            }

            ##OFFBOARDING SELESAI
            $this->offboardingDone($offboardingTicket);

            return response()->json("Success");
        } else {
            $offboardingTicket->checkpoint->acc_svp = $request->status == '1' ? true : false;
            $offboardingTicket->effective_date = $request->effective_date;
        }
        $offboardingTicket->push();
        $offboardingTicket->save();

        if ($offboardingTicket->checkpoint->acc_employee == false) {
            if ($offboardingTicket->status_id != "-3") {
                $offboardingTicket->status_id = "-3";
                if (
                    $offboardingTicket->save()
                ) {
                    $this->addProgressRecord(
                        $request->offboardingID,
                        true,
                        false,
                        "Employee Cancel Offboarding",
                    );
                }
                ##EMPLOYEE CANCEL
                Mail::to('offboarding.indosat@getnada.com')->send(new ResignationRequest($offboardingTicket, -3, 'info'));

                // $input = array(
                //     'processTypeIn' => 2,
                //     'offboardingIDIn' => $offboardingTicket->id,
                // );
                // $input = json_encode($input);
                // $this->startProcess($input);
            }
        } elseif ($offboardingTicket->checkpoint->acc_svp == true) {
            $offboardingTicket->status_id = "2";
            if (
                $offboardingTicket->save()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "SVP Confirm Offboarding",
                );
            }

            if (str_contains($offboardingTicket->type_id, 'e20')) {
                ##EXIT INTERVIEW FORM and request to send email about menyiapkan dokumen
                $input = array(
                    'processTypeIn' => 2,
                    'offboardingIDIn' => $offboardingTicket->id,
                    // 'offboardingIDIn' => 90,
                    // 'IN_dateChanged' => $dateChanged,
                );
                $input = json_encode($input);
                $this->startProcess($input);
                if ($dateChanged) {
                    Mail::to($offboardingTicket->employee->email)->send(new ResignationRequest($offboardingTicket, 3, 'info'));
                }
            }

            ##DOCUMENT EXIT REQUEST
            $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
            Mail::to([
                "docexitreq@getnada.com",
                $emailList[1]['value'],
                $emailList[2]['value'],
                $emailList[3]['value'],
                $emailList[4]['value'],
                $emailList[5]['value'],
                $emailList[6]['value'],
            ])->send(new DocumentExitRequest($offboardingTicket, 1));


            ## DIPINDAH
            // ##ASK HRBP TO UPDATE EXIT INTERVIEW FORM
            // Mail::to("hrbp@getnada.com")->send(new DocumentExitRequest($offboardingTicket, 3));

            ##CHANGE STATUS TO 3
            $offboardingTicket->status_id = "3";
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
        } elseif ($offboardingTicket->checkpoint->acc_svp == false && $offboardingTicket->status_id != "-2") {
            ##SVP Not Confirm
            Mail::to($offboardingTicket->employee->email)->send(new ResignationRequest($offboardingTicket, -2, 'info'));
            if (
                $offboardingTicket->save()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "SVP Not Confirm Offboarding",
                );
            }
        }

        return response()->json("Success", 200);
    }
    public function postRequestDocument(Request $request)
    {
        $offboardingTicket = Offboarding::find($request->offboardingID);

        $docLink = null;
        if ($request->file('file')) {
            $file = $request->file('file');
            $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();

            $path = Storage::putFileAs(
                'public/Documents/Exit Clearance',
                $request->file('file'),
                $fileName
            );
            $docLink = config('app.url') . Storage::url($path);
        }
        if (
            $request->type == 'PL'
            // || $request->type == 'exitinterview'
        ) {
            $doc = null;
            if ($request->type == 'PL') {
                $doc = ["pl", "paklaring"];
            } else {
                $doc = ["exit_interview_form"];
            }
            foreach ($doc as $key => $value) {
                $file = $request->file($value);
                $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
                $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();

                $path = Storage::putFileAs(
                    'public/Documents/Exit Clearance',
                    $request->file($value),
                    $fileName
                );
                $docLink[$value] = config('app.url') . Storage::url($path);
            }
        }
        if ($request->type == 'cv') {
            $file = $request->file('cv');
            $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();

            $path = Storage::putFileAs(
                'public/Documents/CV',
                $request->file('cv'),
                $fileName
            );
            $docLink = config('app.url') . Storage::url($path);
            $offboardingTicket->details->employee_CV_link = $docLink;
            if (
                $offboardingTicket->push()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "CV Uploaded",
                );
            }
        }
        switch ($request->dept) {
            case 'fastel':
                $offboardingTicket->exitClearance->attachment_fastel = $docLink;
                $offboardingTicket->checkpoint->confirm_fastel = true;
                break;
            case 'kopindosat':
                $offboardingTicket->exitClearance->attachment_kopindosat = $docLink;
                $offboardingTicket->checkpoint->confirm_kopindosat = true;
                break;
            case 'it':
                $offboardingTicket->exitClearance->attachment_it = $docLink;
                $offboardingTicket->checkpoint->confirm_it = true;
                break;
            case 'hrdev':
                $offboardingTicket->exitClearance->attachment_hrdev = $docLink;
                $offboardingTicket->checkpoint->confirm_hrdev = true;
                break;
            case 'medical':
                $offboardingTicket->exitClearance->attachment_medical = $docLink;
                $offboardingTicket->checkpoint->confirm_medical = true;
                break;
            case 'finance':
                $offboardingTicket->exitClearance->attachment_finance = $docLink;
                $offboardingTicket->checkpoint->confirm_finance = true;
                break;
            case 'hrss':
                $offboardingTicket->details->personnel_letter_link = $docLink["pl"];
                $offboardingTicket->details->paklaring = $docLink["paklaring"];
                $offboardingTicket->checkpoint->acc_hrss = true;
                break;
            case 'hrbp':
                // $offboardingTicket->details->exit_interview_form = $docLink["exit_interview_form"];
                // $offboardingTicket->details->note_procedure = $docLink["note_procedure"];
                $offboardingTicket->checkpoint->exit_interview = true;
                break;
            default:
                # code...
                break;
        }
        $offboardingTicket->push();

        if ($request->dept == "payroll") {
            // $offboardingTicket->details->payroll_link = $docLink;
            $offboardingTicket->checkpoint->confirm_payroll = true;
            // $offboardingTicket->status_id = "4";
            $offboardingTicket->save();
            if (
                $offboardingTicket->push()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Payroll Calculated",
                );
            }
            // $input = array(
            //     'processTypeIn' => 3,
            //     'offboardingIDIn' => $request->offboardingID,
            //     'IN_processPayroll' => 1
            // );
            // $input = json_encode($input);
            // $this->startProcess($input);
        } else {
            if ($request->dept == "it") {
                // $input = array(
                //     'processTypeIn' => 3,
                //     'offboardingIDIn' => $request->offboardingID,
                //     'IN_dept' => $request->dept,
                // );
                // $input = json_encode($input);
                // $this->startProcess($input);
                return response()->json("Success", 200);
            }
            if (
                $request->dept != "hrbp" &&
                $request->dept != "hrss" &&
                $offboardingTicket->checkpoint->confirm_fastel == true &&
                $offboardingTicket->checkpoint->confirm_kopindosat == true &&
                // $offboardingTicket->checkpoint->confirm_it == true &&
                $offboardingTicket->checkpoint->confirm_hrdev == true &&
                $offboardingTicket->checkpoint->confirm_medical == true &&
                $offboardingTicket->checkpoint->confirm_finance == true
                // && $offboardingTicket->checkpoint->sent_payroll != true
            ) {
                // $offboardingTicket->checkpoint->sent_payroll = true;
                $offboardingTicket->save();
                $offboardingTicket->push();
                $input = array(
                    'processTypeIn' => 3,
                    'offboardingIDIn' => $request->offboardingID,
                );
                $input = json_encode($input);
                $this->startProcess($input);
                return response()->json("Success", 200);
            }
        }

        return response()->json("Success", 200);
    }

    public function postReturnDocument(Request $request)
    {
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $input = null;
        if ($request->type == "confirmation") {
            if ($request->completed == 'true') {
                switch ($request->dept) {
                    case 'svp':
                        $offboardingTicket->checkpoint->return_to_svp = true;
                        break;
                    case 'hrss_softfile':
                        $offboardingTicket->checkpoint->return_to_hrss_doc = true;

                        // $input = array(
                        //     'processTypeIn' => 5,
                        //     'offboardingIDIn' => $request->offboardingID,
                        //     'IN_confirm' => 1,
                        // );
                        // $input = json_encode($input);
                        // $this->startProcess($input);
                        ##Email to Medical, Opers
                        break;
                    case 'hrss_it':
                        $offboardingTicket->checkpoint->return_to_hrss_it = true;
                        break;
                    default:
                        break;
                }
                if ($offboardingTicket->push()) {
                    $this->addProgressRecord(
                        $request->offboardingID,
                        true,
                        false,
                        "Exit Clearance Confirmed by " . $request->dept,
                    );
                }
                if (
                    $offboardingTicket->checkpoint->return_to_svp == true &&
                    $offboardingTicket->checkpoint->return_to_hrss_doc == true &&
                    $offboardingTicket->checkpoint->return_to_hrss_it == true
                ) {
                    $offboardingTicket->status_id = "6";
                    if (
                        $offboardingTicket->save()
                    ) {
                        $this->addProgressRecord(
                            $request->offboardingID,
                            true,
                            false,
                            "Exit Clearance Completed",
                        );
                    }

                    // $input = array(
                    //     'processTypeIn' => 5,
                    //     'offboardingIDIn' => $request->offboardingID,
                    // );
                    // $input = json_encode($input);
                    // $this->startProcess($input);

                    ##EMAIL KE HRMGR
                    ##APPROVAL HR MGR
                    $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
                    Mail::to(["hrmgr@getnada.com", $emailList[8]['value']])->send(new DocumentExitRequest($offboardingTicket, 2));

                    // ##OFFBOARDING SELESAI
                    // Mail::to($offboardingTicket->employee->email)->send(new EmployeeClearDocument($offboardingTicket, 4, null));
                    // Mail::to('payroll@getnada.com')->send(new EmployeeClearDocument($offboardingTicket, 5, null, 'info'));
                }
            } else {
                $message = array(
                    // 'processTypeIn' => 4,
                    // 'offboardingIDIn' => $request->offboardingID,
                    // 'IN_confirm' => 1,
                    'dept' => $request->dept,
                    'message' => $request->message,
                );
                // $input = json_encode($input);
                // $this->startProcess($input);
                // return response()->json($message);
                ##MAIL FEEDBACK TO EMPLOYEE
                Mail::to($offboardingTicket->employee->email)->send(new EmployeeClearDocument($offboardingTicket, 3, $message, 'info'));

                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Dept " . $request->dept . " notify employees there are still not completed",
                );
            }
        } else {
            $offboardingTicket->status_id = "5";
            $offboardingTicket->save();

            $doc = ["signedDocument", "formDocument", "opers", "jobTransfer", "bpjs"];
            foreach ($doc as $key => $value) {
                $file = $request->file($value);
                $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
                $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();

                $path = Storage::putFileAs(
                    'public/Documents/Offboarding/' . $offboardingTicket->id,
                    $request->file($value),
                    $fileName
                );
                $docLink[$value] = config('app.url') . Storage::url($path);
            }

            $offboardingTicket->details->exitDocument = $docLink["signedDocument"];
            $offboardingTicket->details->returnDocument = $docLink["formDocument"];
            $offboardingTicket->details->change_opers = $docLink["opers"];
            $offboardingTicket->details->job_tranfer_attachment = $docLink["jobTransfer"];
            $offboardingTicket->details->bpjs_attachment = $docLink["bpjs"];
            $offboardingTicket->details->returnType = $request->type;
            if (
                $offboardingTicket->push()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Employees Return Exit Clearance",
                );
            }
            $input = array(
                'processTypeIn' => 4,
                'offboardingIDIn' => $request->offboardingID,
                'IN_confirm' => 0,
            );
            $input = json_encode($input);
            $this->startProcess($input);
        }


        return response()->json("Success", 200);
    }

    public function postBast(Request $request)
    {
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $file = $request->file('bast');
        $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
        $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();
        $path = Storage::putFileAs(
            'public/Documents/Offboarding/' . $offboardingTicket->id,
            $request->file('bast'),
            'BAST-' . $fileName
        );
        $directory = config('app.url') . Storage::url($path);
        $offboardingTicket->details->bast_attachment = $directory;
        // $offboardingTicket->push();
        // return response()->json($directory);
        if ($offboardingTicket->push()) {
            $this->addProgressRecord(
                $request->offboardingID,
                true,
                false,
                "BAST Returned",
            );
        }

        return response()->json("Success", 200);
    }

    public function employeePendingReturnDocument()
    {
        $offboardingPending = Offboarding::where("status", "4")->get();
        $emailList = [];
        foreach ($offboardingPending as $key => $value) {
            $emailList[$key] = $value->employee->email;
        }
        return response()->json($emailList);
    }
    public function offboardingStatus(Request $request)
    {
        $data = [];
        $data['progress'] = [];
        switch ($request->type) {
            case 'progress':
                $data['total'] = Offboarding::whereBetween('status_id', [0, 5])
                    ->orderBy('status_id')
                    ->get()
                    ->groupBy('status_id');
                $data['progress'] = [];
                $i = 0;
                foreach ($data['total'] as $key => $value) {
                    $name = StatusDetail::where('code', $key)->first()->name;
                    $data['progress']['name'][$i] = $name;
                    $data['progress']['count'][$i] = count($value);
                    $i++;
                }


                $data['rawType'] = Offboarding::get()
                    ->groupBy('type_id');
                $i = 0;
                foreach ($data['rawType'] as $key => $value) {
                    $name = TypeDetail::where('code', $key)->first()->name;
                    $data['type']['name'][$i] = $name;
                    $data['type']['count'][$i] = count($value);
                    $i++;
                }

                $data['rawMonths'] = Offboarding::select(
                    DB::raw('count(*) as count'),
                    DB::raw("(DATE_FORMAT(effective_date, '%M %Y')) as month_year")
                )
                    ->orderBy('effective_date')
                    ->where('status_id', '>=', 0)
                    ->groupBy("month_year")
                    ->get();

                $data['months'] = [];
                foreach ($data['rawMonths'] as $key => $value) {
                    $data['months']['name'][$key] = $value->month_year;
                    $data['months']['count'][$key] = $value->count;
                }
                $data['rawMonths'] = null;
                $data['total'] = null;
                $data['rawType'] = null;
                break;
            default:
                $data['total'] = Offboarding::get()->count();
                $data['ongoing'] = Offboarding::whereBetween('status_id', [0, 5])->get()->count();
                $data['completed'] = Offboarding::where("status_id", "6")->get()->count();
                $data['failed'] = Offboarding::where('status_id', '<', 0)->get()->count();
                $data['turnoverratio'] = $data['completed'] / Employee::get()->count() * 100;
                break;
        }
        return response()->json($data);
    }
    public function exitDocument(Request $request)
    {
        $fileData = null;
        $folder = null;
        if ($request->clearance == 'true') {
            $folder = '/TemplateDocuments/TemplateClearance/';
        } else {
            $folder = '/TemplateDocuments/ExitDocument/';
        }
        $path = public_path($folder);
        $files = File::files($path);
        foreach ($files as $key => $value) {
            $fileData[$key]['file'] = config('app.url') . $folder . pathinfo($value)['filename'] . '.' . pathinfo($value)['extension'];
            $fileData[$key]['name'] = pathinfo($value)['filename'];
        }
        // return dd($files);
        return response()->json($fileData);
    }
    public function retireEmployee()
    {
        $retireEmployee = null;
        $date = date('Y-m-d', mktime(0, 0, 0, date("m"),   date("d") + 120,   date("Y") - 56));
        $effectiveDate = date('Y-m-d', mktime(0, 0, 0, date("m"),   date("d") + 120,   date("Y")));
        $data = Employee::whereDate('birth_date', '=', $date)->get();
        foreach ($data as $key => $value) {
            $retireEmployee[$key] = $value->email;
            $this->retireOffboarding($value->id, $effectiveDate);
        }
        return response()->json(["date" => $date, "data" => $retireEmployee]);
    }
    public function reminderDocRequest()
    {
        $data['kopindosat@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_kopindosat', '=', null);
        })->get();
        $data['fastel@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_fastel', '=', null);
        })->get();
        $data['it@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_it', '=', null);
        })->get();
        $data['hrdev@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_hrdev', '=', null);
        })->get();
        $data['medical@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_medical', '=', null);
        })->get();
        $data['finance@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_finance', '=', null);
        })->get();
        $data['payroll@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_payroll', '=', null);
        })->get();
        $data['hrss@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_hrss', '=', null);
        })->get();
        $data['hrbp_mgr@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('confirm_hrbp_mgr', '=', null);
        })->get();
        // $data['kopindosat'] = OffboardingCheckpoint::where('confirm_kopindosat', '=', null)->with('offboarding')->get();
        return response()->json($data);
    }


    private function retireOffboarding($ID, $date)
    {
        $employeeID = $ID;
        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $employeeID;
        $offboardingTicket->effective_date = $date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->status_id = "2";
        $offboardingTicket->type_id = "e101";
        $offboardingTicket->save();

        $offboardingDetail = new OffboardingDetail;
        $offboardingDetail->offboarding_id = $offboardingTicket->id;
        $offboardingTicket->details()->save($offboardingDetail);
        $checkpoint = new OffboardingCheckpoint();
        $checkpoint->acc_employee = true;
        $checkpoint->acc_svp = true;
        $offboardingTicket->checkpoint()->save($checkpoint);
        $exitClearance = new ExitClearance();
        $offboardingTicket->checkpoint()->save($exitClearance);
        $this->addProgressRecord(
            $offboardingTicket->id,
            true,
            false,
            "Offboarding Process Created",
        );
        $processType = 2;
        $input = array(
            'employeeIDIn' => $ID,
            'processTypeIn' => $processType,
            'offboardingIDIn' => $offboardingTicket->id,
        );
        $input = json_encode($input);
        $this->startProcess($input);
        return true;
    }

    public function postRightObligation(Request $request)
    {
        $finalData = [];
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $data = json_decode($request->items, true);
        // return $data;
        // if (
        //     $request->dept == 'fastel' ||
        //     $request->dept == 'kopindosat' ||
        //     $request->dept == 'medical' ||
        //     $request->dept == 'finance'
        // ) {
        //     $data['Outstanding'] = str_replace("Rp. ", "", $data['Outstanding']);
        //     $data['Outstanding'] = str_replace(".", "", $data['Outstanding']);
        // }
        // if (!isEmpty($data[0])
        //  || $request->outstanding_exist == 'true'
        //  ) {
        //     return response()->json(["true",$data]);
        // }else {
        //     return response()->json(["false",$data]);
        // }
        switch ($request->dept) {
            case 'fastel':
                if (isset($data[0]['Outstanding'])) {
                    $data[0]['Outstanding'] = str_replace("Rp. ", "", $data[0]['Outstanding']);
                    $data[0]['Outstanding'] = str_replace(".", "", $data[0]['Outstanding']);
                }
                $offboardingTicket->exitClearance->fastel = $data;
                $offboardingTicket->checkpoint->confirm_fastel = true;
                break;
            case 'kopindosat':
                if (isset($data[0]['Hak']) && isset($data[0]['Kewajiban'])) {
                    $data[0]['Hak'] = str_replace("Rp. ", "", $data[0]['Hak']);
                    $data[0]['Hak'] = str_replace(".", "", $data[0]['Hak']);
                    $data[0]['Kewajiban'] = str_replace("Rp. ", "", $data[0]['Kewajiban']);
                    $data[0]['Kewajiban'] = str_replace(".", "", $data[0]['Kewajiban']);
                    $data[0]['Selisih'] = $data[0]['Hak'] - $data[0]['Kewajiban'];
                }
                $offboardingTicket->exitClearance->kopindosat = $data;
                $offboardingTicket->checkpoint->confirm_kopindosat = true;
                break;
            case 'it':
                $offboardingTicket->exitClearance->it = $data;
                $offboardingTicket->checkpoint->confirm_it = true;
                break;
            case 'hrdev':
                $offboardingTicket->exitClearance->hrdev = $data;
                $offboardingTicket->checkpoint->confirm_hrdev = true;
                break;
            case 'medical':
                if (isset($data[0]['Ekses Medical'])) {
                    $data[0]['Ekses Medical'] = str_replace("Rp. ", "", $data[0]['Ekses Medical']);
                    $data[0]['Ekses Medical'] = str_replace(".", "", $data[0]['Ekses Medical']);
                }
                $offboardingTicket->exitClearance->medical = $data;
                $offboardingTicket->checkpoint->confirm_medical = true;
                break;
            case 'finance':
                $offboardingTicket->exitClearance->finance = $data;
                $offboardingTicket->checkpoint->confirm_finance = true;
                break;
            default:
                # code...
                break;
        }
        if ($offboardingTicket->push()) {
            $this->addProgressRecord(
                $request->offboardingID,
                true,
                false,
                "Document Request Responded by " . $request->dept,
            );
        } else {
            $this->addProgressRecord(
                $request->offboardingID,
                false,
                false,
                "Document Request Failed Responded by " . $request->dept,
            );
        }
        if ($request->dept == "it" && $request->outstanding_exist == 'true') {
            Mail::to($offboardingTicket->employee->email)->send(new DocumentExitRequest($offboardingTicket, 4));
            // $input = array(
            //     'processTypeIn' => 3,
            //     'offboardingIDIn' => $request->offboardingID,
            //     'IN_dept' => $request->dept,
            // );
            // $input = json_encode($input);
            // $this->startProcess($input);
            return response()->json("Success", 200);
        }
        if (
            $request->dept != "hrbp" &&
            $request->dept != "hrss" &&
            $offboardingTicket->checkpoint->confirm_fastel == true &&
            $offboardingTicket->checkpoint->confirm_kopindosat == true &&
            $offboardingTicket->checkpoint->confirm_hrdev == true &&
            $offboardingTicket->checkpoint->confirm_medical == true &&
            $offboardingTicket->checkpoint->confirm_finance == true
            // && $offboardingTicket->checkpoint->sent_payroll != true
        ) {
            // $offboardingTicket->checkpoint->sent_payroll = true;
            $offboardingTicket->status_id = "4";
            $offboardingTicket->save();
            $offboardingTicket->push();
            if ($offboardingTicket->push()) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Document Request Completed",
                );
            }
            $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
            Mail::to(['payroll@getnada.com', $emailList[7]['value']])->send(new DocumentExitRequest($offboardingTicket, 5));
            // $input = array(
            //     'processTypeIn' => 3,
            //     'offboardingIDIn' => $request->offboardingID,
            // );
            // $input = json_encode($input);
            // $this->startProcess($input);
            return response()->json("Success", 200);
        }
        return response()->json('Success');
    }
    public function postProgressRecord(Request $request)
    {
        $status = $request->status == '1' ? true : false;
        $uipath = $request->uipath == '1' ? true : false;
        $reminder = $request->reminder == '1' ? true : false;
        $process_type = $request->process_type != null ? $request->process_type : null;
        if ($reminder) {
            $this->addProgressRecord(
                $request->offboardingID,
                $status,
                $uipath,
                $request->message,
                $reminder,
                $process_type,
            );
        } else {
            $this->addProgressRecord(
                $request->offboardingID,
                $status,
                $uipath,
                $request->message,
            );
        }
        return response()->json("Success");
    }
    public function reportScheduler()
    {
        $data = ProgressRecord::where("reminder", true)->get();
        return response()->json($data);
    }

    public function accResignDocument(Request $request)
    {
        $offboarding = Offboarding::where('token', $request->token)->where('id', $request->id)->first();
        if (!$offboarding) {
            return response()->json('Fail', 400);
        }
        $action = $request->action == "accept" ? true : false;
        if ($action) {
            $offboarding->status = "1";
            // $offboarding->checkpoint->acc_document = "1";
            if (
                $offboarding->push()
            ) {
                $this->addProgressRecord(
                    $offboarding->id,
                    true,
                    false,
                    "Admin Approve Resign Letter Manually",
                );
            }
            $input = array(
                'processTypeIn' => 1,
                'offboardingIDIn' => $offboarding->id,
                'IN_accResignDocument' => "1"
            );
            $input = json_encode($input);
            $this->startProcess($input);
        } else {
            $offboarding->status = "-1";
            // $offboarding->checkpoint->acc_document = "0";
            if (
                $offboarding->push()
            ) {
                $this->addProgressRecord(
                    $offboarding->id,
                    true,
                    false,
                    "Admin Reject Resign Letter Manually",
                );
            }
            $input = array(
                'processTypeIn' => 1,
                'offboardingIDIn' => $offboarding->id,
                'IN_accResignDocument' => "-1"
            );
            $input = json_encode($input);
            $this->startProcess($input);
        }
        $path = config('app.url') . "/offboarding/" . $offboarding->id . "?token=" . $offboarding->token . "&tracking=true";
        return redirect()->back();
        return redirect($path);
    }

    public function retryCV(Request $request)
    {
        $offboarding = Offboarding::where('id', $request->id)->first();
        if (!$offboarding) {
            return response()->json('Fail', 400);
        }

        $input = array(
            'processTypeIn' => 2,
            'offboardingIDIn' => $offboarding->id,
            'IN_CV' => "1"
        );
        $input = json_encode($input);
        $this->startProcess($input);

        $path = config('app.url') . "/offboarding/" . $offboarding->id . "?token=" . $offboarding->token . "&tracking=true";
        return redirect()->back();
        return redirect($path);
    }

    private function addProgressRecord($offboardingID, $status, $uipath, $message, $reminder = null, $process_type = null)
    {
        $record = new ProgressRecord;
        $record->offboarding_id = $offboardingID;
        $record->status = $status;
        $record->uipath = $uipath;
        $record->message = $message;
        $record->reminder = $reminder;
        $record->process_type = $process_type;
        $record->save();
        return $record;
    }

    public function postOffboardingForm(Request $request)
    {
        $rawData['type'] = $request->type;
        $rawData['id'] = $request->offboardingID;
        $rawData['data'] = json_decode($request->data);
        $data['data'] = $rawData['data']->items;
        $data['additional_comment'] = isset($rawData['data']->comment) ? $rawData['data']->comment : '-';

        $offboardingTicket = Offboarding::find($request->offboardingID);
        if ($rawData['type'] == 'exit_interview_form') {
            $data['other_activity'] = $rawData['data']->otherActivity;
            $offboardingTicket->offboardingForm->exit_interview_form = $data;
            if (
                $offboardingTicket->push()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Employees Fill Exit Interview Form",
                );
            }
            ##Send email to SVP
            $svp = Employee::find($offboardingTicket->employee->department->hr_svp_id)->email;
            Mail::to(['svp@getnada.com',$svp])->send(new EmployeeClearDocument($offboardingTicket));
        } elseif ($rawData['type'] == 'return_document') {
            $data['return_type'] = array(
                'type' => $rawData['data']->type,
                'data' => $rawData['data']->itemOnline,
            );
            // $data['return_type']['data'] = $rawData['data']->itemOnline;
            $offboardingTicket->offboardingForm->return_document_form = $data;
            $offboardingTicket->status_id = '5';
            if (
                $offboardingTicket->push()
            ) {
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Employees Return Exit Clearance",
                );
            }
            ##Send email to HRSS IT, SVP, HRSS softfile
            $svp = Employee::find($offboardingTicket->employee->department->hr_svp_id)->email;
            $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
            Mail::to([
                'svp@getnada.com', 'hrss_softfile@getnada.com', 'hrss_it@getnada.com',
                $svp, $emailList[0]['value'], $emailList[1]['value'],
            ])->send(new EmployeeClearDocument($offboardingTicket, 2));
        }


        return $data;
        return $rawData;
    }

    public function postComment(Request $request)
    {
        $offboardingTicket = Offboarding::find($request->offboardingID);
        // return response()->json($request->all());
        $comment = $offboardingTicket->comments()->create([
            'from' => $request->from,
            'comment' => $request->comment,
            // 'message' => 'A new comment.',
        ]);
        // $offboardingTicket->comments()->save($comment);
        return response()->json('Success');
    }

    private function offboardingDone($offboardingData = null)
    {
        $emailList = json_decode(OffboardingConfig::where(['key' => 'email_list'])->first()->value, true);
        Mail::to($offboardingData->employee->email)->send(new EmployeeClearDocument($offboardingData, 4, null));
        Mail::to(['payroll@getnada.com', $emailList[7]['value']])->send(new EmployeeClearDocument($offboardingData, 5, null, 'info'));


        ##INPUT ARRAY
        ##employeeID,offboardingID,type

        ##DOCUMENT CODE
        ## 1 - Generate Resignation Letter PDF
        ## 2 - Generate CV PDF
        ## 3 - Generate Payroll PDF
        ## 4 - Generate PL
        ## 5 - Generate PAKLARING
        ## 6 - Generate Termination Letter
        ## 7 - Exit Interview Form Link
        ## 8 - BPJS Link
        ## 9 - BAST Link

        for ($i = 1; $i <= 9; $i++) {
            $input = array(
                'employeeID' => $offboardingData->employee->id,
                'offboardingID' => $offboardingData->id,
                'type' => $i,
            );
            $this->generatePDF($input);
        }
    }

    public function postConfiguration(Request $request)
    {
        $config = null;
        if ($request->type == 'get') {
            $config = OffboardingConfig::where(['key' => 'email_list'])->first();
            if (!$config) {
                $config = "Not Found";
            }
        } else {
            $rawData['data'] = $request->data;
            // $config = OffboardingConfig::firstOrNew(
            //     ['key' => 'email_list'],
            //     ['value' => $rawData['data']]
            // );
            $config = OffboardingConfig::where('key','email_list')->first();
            $config->value = $rawData['data'];
            $config->save();
            return response()->json("Saved");
        }
        return response()->json($config);
    }
}

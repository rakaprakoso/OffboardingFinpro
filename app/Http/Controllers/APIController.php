<?php

namespace App\Http\Controllers;

use App\Models\Offboarding;
use App\Models\OffboardingDetail;
use App\Models\Employee;
use App\Models\OffboardingCheckpoint;
use App\Models\ExitClearance;
use App\Models\RightObligation;
use App\Models\StatusDetail;
use App\Models\TypeDetail;
use App\Models\ProgressRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use File;
use DB;

class APIController extends Controller
{
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
            'ReleaseKey' => '842a7024-05c7-4856-8da7-e6a8814692c9',
            'Strategy' => 'ModernJobsCount',
            "RuntimeType" => "Development",
            "RobotIds" => [],
            "NoOfRobots" => 0,
            "JobsCount" => 1,
            // 'Strategy' => 'All',
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
        // curl_setopt($ch, CURLOPT_TIMEOUT,60);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $result = curl_exec($ch);
        echo $result;
        curl_close($ch);

        $obj = json_decode($result);
        $procid = $obj->value[0]->Id;
        $waitloop = true;

        // do {
        //     sleep(5);
        //     //Check the status of the process
        //     $url = 'https://platform.uipath.com/presiaykbmhx/Indosat/odata/Jobs?$filter=Id%20eq%20' . $procid;
        //     $ch = curl_init($url);
        //     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        //     curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json', 'X-UIPATH-TenantName: INDOSAT', 'Authorization: Bearer ' . $auth, 'User-Agent: telnet'));

        //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //     curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        //     curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        //     curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        //     $result = curl_exec($ch);
        //     curl_close($ch);

        //     $obj = json_decode($result);
        //     //echo $obj->value[0]->State;
        //     if (substr($obj->value[0]->State, 0, 4) === "Succ") {
        //         echo $obj->value[0]->OutputArguments;
        //         $waitloop = false;
        //     }
        // } while ($waitloop);
    }

    public function postResignForm(Request $request)
    {
        $employeeID = $request->employeeIDIn;
        // return $request->all();

        $processOffboarding = Offboarding::where('employee_id', $employeeID)->whereBetween('status', [0, 6])->get()->count();
        if ($processOffboarding>0) {
            return response()->json('Fail', 400);
        }

        if ($request->admin != "true") {
            $this->validate($request, [
                'employeeIDIn' => 'required|exists:employees,id',
                'resign_letter' => 'required|file|max:7000', // max 7MB
            ]);
            $employee = Employee::where('id', $employeeID)->where('password', $request->password)->first();
            if (!$employee) {
                return response()->json('Fail', 400);
            }
        } elseif ($request->adminPublic == "true") {
            $svp = Employee::where('id', $request->svpID)->where('password', $request->svpPassword)->first();
            if (!$svp) {
                return response()->json('Fail', 400);
            }
            $employeeID = $request->employeeID;
        }
        // else {
        //     $employeeID = $request->employeeID;
        // }

        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $employeeID;
        $offboardingTicket->effective_date = $request->effective_date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->status = "0";

        if ($request->admin != "true") {
            $offboardingTicket->type = "e202";
        } else {
            $offboardingTicket->type = $request->type;
        }

        if ($offboardingTicket->type != "e202" && $offboardingTicket->type != "e201") {
            $offboardingTicket->status = "3";
        }

        $offboardingTicket->save();

        $offboardingDetail = new OffboardingDetail;
        $offboardingDetail->offboarding_id = $offboardingTicket->id;
        $offboardingDetail->reason = $request->reason;
        if ($request->file('resign_letter')) {
            $file = $request->file('resign_letter');
            $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();
            $path = Storage::putFileAs(
                'public/Documents/Resign Letter',
                $request->file('resign_letter'),
                $fileName
            );
            $offboardingDetail->resignation_letter_link = config('app.url') . Storage::url($path);
        }
        $offboardingTicket->details()->save($offboardingDetail);

        $checkpoint = new OffboardingCheckpoint();
        $checkpoint->acc_employee = true;
        if ($offboardingTicket->type != "e202" && $offboardingTicket->type != "e201") {
            $checkpoint->acc_svp = true;
            $checkpoint->acc_document = true;
        }
        $offboardingTicket->checkpoint()->save($checkpoint);
        $exitClearance = new ExitClearance();
        $offboardingTicket->exitClearance()->save($exitClearance);
        $rightObligation = new RightObligation();
        $offboardingTicket->rightObligation()->save($rightObligation);

        $processType = 1;
        if ($offboardingTicket->type != "e202") {
            $processType = 2;
        }

        $this->addProgressRecord(
            $offboardingTicket->id,
            true,
            false,
            "Offboarding Ticket Created",
        );
        $input = array(
            'employeeIDIn' => $request->employeeIDIn,
            'processTypeIn' => $processType,
            'offboardingIDIn' => $offboardingTicket->id,
        );
        $input = json_encode($input);
        $this->startProcess($input);
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
        // $offboardingTicket->status = $request->status;
        // $offboardingTicket->save();
        if ($request->employee == '1') {
            $offboardingTicket->checkpoint->acc_employee = $request->status == '1' ? true : false;
        } elseif ($request->hrmgr == '1') {
            $offboardingTicket->checkpoint->acc_hrbp_mgr = $request->status == '1' ? true : false;
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
            }
            return response()->json("Success");
        } else {
            $offboardingTicket->checkpoint->acc_svp = $request->status == '1' ? true : false;
            $offboardingTicket->effective_date = $request->effective_date;
        }
        $offboardingTicket->push();
        $offboardingTicket->save();

        // $offboardingTicket = Offboarding::find($request->offboardingID);


        if ($offboardingTicket->checkpoint->acc_employee == false) {
            if ($offboardingTicket->status != "-3") {
                $offboardingTicket->status = "-3";
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
                $input = array(
                    'processTypeIn' => 2,
                    'offboardingIDIn' => $offboardingTicket->id,
                );
                $input = json_encode($input);
                $this->startProcess($input);
            }
        } elseif ($offboardingTicket->checkpoint->acc_svp == true) {
            $offboardingTicket->status = "2";
            // $offboardingTicket->token = Str::random(64);
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

            $input = array(
                'processTypeIn' => 2,
                'offboardingIDIn' => $offboardingTicket->id,
                'IN_dateChanged' => $dateChanged,
            );
            $input = json_encode($input);
            $this->startProcess($input);
        }

        return response()->json("Success", 200);
    }
    public function postRequestDocument(Request $request)
    {
        // return response()->json($request->all());
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
        if ($request->type == 'PL' || $request->type == 'exitinterview') {
            $doc = null;
            if ($request->type == 'PL') {
                $doc = ["pl", "paklaring"];
            } else {
                $doc = ["exit_interview_form", "note_procedure"];
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
                $offboardingTicket->checkpoint->acc_fastel = true;
                break;
            case 'kopindosat':
                $offboardingTicket->exitClearance->attachment_kopindosat = $docLink;
                $offboardingTicket->checkpoint->acc_kopindosat = true;
                break;
            case 'it':
                $offboardingTicket->exitClearance->attachment_it = $docLink;
                $offboardingTicket->checkpoint->acc_it = true;
                break;
            case 'hrdev':
                $offboardingTicket->exitClearance->attachment_hrdev = $docLink;
                $offboardingTicket->checkpoint->acc_hrdev = true;
                break;
            case 'medical':
                $offboardingTicket->exitClearance->attachment_medical = $docLink;
                $offboardingTicket->checkpoint->acc_medical = true;
                break;
            case 'finance':
                $offboardingTicket->exitClearance->attachment_finance = $docLink;
                $offboardingTicket->checkpoint->acc_finance = true;
                break;
            case 'hrss':
                $offboardingTicket->details->personnel_letter_link = $docLink["pl"];
                $offboardingTicket->details->paklaring = $docLink["paklaring"];
                // $offboardingTicket->details->termination_letter_link = $docLink["termination_letter"];
                $offboardingTicket->checkpoint->acc_hrss = true;
                break;
            case 'hrbp':
                $offboardingTicket->details->exit_interview_form = $docLink["exit_interview_form"];
                $offboardingTicket->details->note_procedure = $docLink["note_procedure"];
                // $offboardingTicket->details->change_opers = $docLink["opers"];
                $offboardingTicket->checkpoint->exit_interview = true;
                break;
            default:
                # code...
                break;
        }
        $offboardingTicket->push();

        if ($request->dept == "payroll") {
            $offboardingTicket->details->payroll_link = $docLink;
            $offboardingTicket->checkpoint->acc_payroll = true;
            $offboardingTicket->status = "4";
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
            $input = array(
                'processTypeIn' => 3,
                'offboardingIDIn' => $request->offboardingID,
                'IN_processPayroll' => 1
            );
            $input = json_encode($input);
            $this->startProcess($input);
        } else {
            if ($request->dept == "it") {
                $input = array(
                    'processTypeIn' => 3,
                    'offboardingIDIn' => $request->offboardingID,
                    'IN_dept' => $request->dept,
                );
                $input = json_encode($input);
                $this->startProcess($input);
                return response()->json("Success", 200);
            }
            if (
                $request->dept != "hrbp" &&
                $request->dept != "hrss" &&
                $offboardingTicket->checkpoint->acc_fastel == true &&
                $offboardingTicket->checkpoint->acc_kopindosat == true &&
                // $offboardingTicket->checkpoint->acc_it == true &&
                $offboardingTicket->checkpoint->acc_hrdev == true &&
                $offboardingTicket->checkpoint->acc_medical == true &&
                $offboardingTicket->checkpoint->acc_finance == true &&
                $offboardingTicket->checkpoint->sent_payroll != true
            ) {
                $offboardingTicket->checkpoint->sent_payroll = true;
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


        // if ($request->dept == '1') {
        //     $offboardingTicket->checkpoint->acc_employee = $request->status == '1' ? true : false;
        // } else {
        //     $offboardingTicket->checkpoint->acc_svp = $request->status == '1' ? true : false;
        //     $offboardingTicket->effective_date = $request->effective_date;
        // }


        // return response()->json($request->all(), 200);
        // $offboardingTicket = Offboarding::find($request->offboardingID);
        // // $offboardingTicket->status = $request->status == "1" ? "2" : "-2";
        // $offboardingTicket->item = $request->item;
        // $offboardingTicket->qty = $request->qty;
        // // $offboardingTicket->token = Str::random(64);
        // $offboardingTicket->save();
        // $items = $request->items;
        // $items = array(
        //     'data1',
        //     'data2',
        //     'data3',
        //     'data4',
        // );
        // return response()->json($items, 200);




        return response()->json("Success", 200);
    }

    public function postReturnDocument(Request $request)
    {
        // return $request->all();
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $input = null;
        if ($request->type == "confirmation") {
            if ($request->completed == 'true') {
                switch ($request->dept) {
                    case 'svp':
                        $offboardingTicket->checkpoint->return_svp = true;
                        break;
                    case 'hrss_softfile':
                        $offboardingTicket->checkpoint->return_hrss_softfile = true;
                        $input = array(
                            'processTypeIn' => 5,
                            'offboardingIDIn' => $request->offboardingID,
                            'IN_confirm' => 1,
                        );
                        $input = json_encode($input);
                        $this->startProcess($input);
                        break;
                    case 'hrss_it':
                        $offboardingTicket->checkpoint->return_hrss_it = true;
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
                        "Exit Clearance Confirmed by " . $request->dept,
                    );
                }
                if (
                    $offboardingTicket->checkpoint->return_svp == true &&
                    $offboardingTicket->checkpoint->return_hrss_softfile == true &&
                    $offboardingTicket->checkpoint->return_hrss_it == true
                ) {
                    $offboardingTicket->status = "6";
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

                    $input = array(
                        'processTypeIn' => 5,
                        'offboardingIDIn' => $request->offboardingID,
                    );
                    $input = json_encode($input);
                    $this->startProcess($input);
                }
            } else {
                $input = array(
                    'processTypeIn' => 4,
                    'offboardingIDIn' => $request->offboardingID,
                    'IN_confirm' => 1,
                    'IN_dept' => $request->dept,
                    'IN_messageEmail' => $request->message,
                );
                $input = json_encode($input);
                $this->startProcess($input);
                $this->addProgressRecord(
                    $request->offboardingID,
                    true,
                    false,
                    "Dept " . $request->dept . " notify employees there are still not completed",
                );
            }
        } else {
            $offboardingTicket->status = "5";
            $offboardingTicket->save();

            // if ($request->file('signedDocument')) {
            //     $file = $request->file('signedDocument');
            //     $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            //     $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();
            //     $path = Storage::putFileAs(
            //         'public/Documents/Return Data',
            //         $request->file('signedDocument'),
            //         $fileName
            //     );
            //     $signedDocument = config('app.url') . Storage::url($path);
            // }
            // if ($request->file('formDocument')) {
            //     $file = $request->file('formDocument');
            //     $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            //     $fileName = $offboardingTicket->employee->name . '-' . $fileHash . '.' . $file->getClientOriginalExtension();
            //     $path = Storage::putFileAs(
            //         'public/Documents/Return Data',
            //         $request->file('formDocument'),
            //         $fileName
            //     );
            //     $formDocument = config('app.url') . Storage::url($path);
            // }


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
                // 'IN_dept' => $request->dept,
                // 'IN_processPayroll' => 1
                // 'IN_item' => $request->item,
                // 'IN_qty' => $request->qty,
                // 'IN_items' => json_decode($items),
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
            $request->file('formDocument'),
            'BAST-' . $fileName
        );
        $directory = config('app.url') . Storage::url($path);
        $offboardingTicket->details->bast_attachment = $directory;
        if ($offboardingTicket->push()) {
            $this->addProgressRecord(
                $request->offboardingID,
                true,
                false,
                $request->message,
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
                $data['total'] = Offboarding::whereBetween('status', [0, 5])
                    ->orderBy('status')
                    ->get()
                    ->groupBy('status')
                    // ->withoutRelations()
                ;
                $data['progress'] = [];
                // for ($i=0; $i < count($data['total']); $i++) {
                //     $data['progress'][$i]['name'] = count($data['total']);
                //     $data['progress'][$i]['count'] = count($data['total']);
                // }
                $i = 0;
                foreach ($data['total'] as $key => $value) {
                    $name = StatusDetail::where('code', $key)->first()->name;
                    $data['progress']['name'][$i] = $name;
                    $data['progress']['count'][$i] = count($value);
                    $i++;
                }


                $data['rawType'] = Offboarding::get()
                    ->groupBy('type');
                $i = 0;
                foreach ($data['rawType'] as $key => $value) {
                    $name = TypeDetail::where('code', $key)->first()->name;
                    $data['type']['name'][$i] = $name;
                    $data['type']['count'][$i] = count($value);
                    $i++;
                }

                // $data['rawMonths'] = Offboarding::
                // select(DB::raw('count(*) as count, status'))
                // ->where('status', '>=', 0)
                // ->groupBy('status')
                // ->get()
                // ;

                $data['rawMonths'] = Offboarding::select(
                    // "id",
                    DB::raw('count(*) as count'),
                    DB::raw("(DATE_FORMAT(effective_date, '%M %Y')) as month_year")
                )
                    ->orderBy('effective_date')
                    ->where('status', '>=', 0)
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
                $data['ongoing'] = Offboarding::whereBetween('status', [0, 5])->get()->count();
                $data['completed'] = Offboarding::where("status", "6")->get()->count();
                $data['failed'] = Offboarding::where('status', '<', 0)->get()->count();
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
            $query->where('acc_kopindosat', '=', null);
        })->get();
        $data['fastel@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_fastel', '=', null);
        })->get();
        $data['it@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_it', '=', null);
        })->get();
        $data['hrdev@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_hrdev', '=', null);
        })->get();
        $data['medical@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_medical', '=', null);
        })->get();
        $data['finance@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_finance', '=', null);
        })->get();
        $data['payroll@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_payroll', '=', null);
        })->get();
        $data['hrss@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_hrss', '=', null);
        })->get();
        $data['hrbp_mgr@getnada.com'] = Offboarding::whereHas('checkpoint', function ($query) {
            $query->where('acc_hrbp_mgr', '=', null);
        })->get();
        // $data['kopindosat'] = OffboardingCheckpoint::where('acc_kopindosat', '=', null)->with('offboarding')->get();
        return response()->json($data);
    }


    private function retireOffboarding($ID, $date)
    {
        $employeeID = $ID;
        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $employeeID;
        $offboardingTicket->effective_date = $date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->status = "2";
        $offboardingTicket->type = "e101";
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
        // return response()->json($request->all());
        $finalData = [];
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $data = json_decode($request->items);
        // $i=0;
        // foreach($data as $key => $value){
        //     foreach($value as $key2 => $value2){
        //         $finalData[$i]["item"] = $key2;
        //         $finalData[$i]["data"] = $value2;
        //         $i++;
        //     }
        //     // $finalData[$i]["item"] = $key;
        //     // $finalData[$i]["data"] = $value;

        // }
        // return response($finalData);

        switch ($request->dept) {
            case 'fastel':
                $offboardingTicket->rightObligation->fastel = $data;
                $offboardingTicket->checkpoint->acc_fastel = true;
                break;
            case 'kopindosat':
                $offboardingTicket->rightObligation->kopindosat = $data;
                $offboardingTicket->checkpoint->acc_kopindosat = true;
                break;
            case 'it':
                $offboardingTicket->rightObligation->it = $data;
                $offboardingTicket->checkpoint->acc_it = true;
                break;
            case 'hrdev':
                $offboardingTicket->rightObligation->hrdev = $data;
                $offboardingTicket->checkpoint->acc_hrdev = true;
                break;
            case 'medical':
                $offboardingTicket->rightObligation->medical = $data;
                $offboardingTicket->checkpoint->acc_medical = true;
                break;
            case 'finance':
                $offboardingTicket->rightObligation->finance = $data;
                $offboardingTicket->checkpoint->acc_finance = true;
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
        if ($request->dept == "it") {
            $input = array(
                'processTypeIn' => 3,
                'offboardingIDIn' => $request->offboardingID,
                'IN_dept' => $request->dept,
            );
            $input = json_encode($input);
            $this->startProcess($input);
            return response()->json("Success", 200);
        }
        if (
            $request->dept != "hrbp" &&
            $request->dept != "hrss" &&
            $offboardingTicket->checkpoint->acc_fastel == true &&
            $offboardingTicket->checkpoint->acc_kopindosat == true &&
            // $offboardingTicket->checkpoint->acc_it == true &&
            $offboardingTicket->checkpoint->acc_hrdev == true &&
            $offboardingTicket->checkpoint->acc_medical == true &&
            $offboardingTicket->checkpoint->acc_finance == true &&
            $offboardingTicket->checkpoint->sent_payroll != true
        ) {
            $offboardingTicket->checkpoint->sent_payroll = true;
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
            $input = array(
                'processTypeIn' => 3,
                'offboardingIDIn' => $request->offboardingID,
            );
            $input = json_encode($input);
            $this->startProcess($input);
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
            $offboarding->checkpoint->acc_document = "1";
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
                    'IN_accResignDocument'=>"1"
                );
                $input = json_encode($input);
                $this->startProcess($input);
        }else{
            $offboarding->status = "-1";
            $offboarding->checkpoint->acc_document = "0";
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
                    'IN_accResignDocument'=>"-1"
                );
                $input = json_encode($input);
                $this->startProcess($input);
        }
        $path= config('app.url') . "/offboarding/".$offboarding->id."?token=".$offboarding->token."&tracking=true";
        return redirect()->back();
        return redirect($path);
        // return response()->json("Success");
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
            'IN_CV'=>"1"
        );
        $input = json_encode($input);
        $this->startProcess($input);

        $path= config('app.url') . "/offboarding/".$offboarding->id."?token=".$offboarding->token."&tracking=true";
        return redirect()->back();
        return redirect($path);
        // return response()->json("Success");
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
}

<?php

namespace App\Http\Controllers;

use App\Models\Offboarding;
use App\Models\OffboardingDetail;
use App\Models\Employee;
use App\Models\OffboardingCheckpoint;
use App\Models\ExitClearance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        // return $request->all();
        $this->validate($request, [
            'employeeIDIn' => 'required|exists:employees,id',
            'resign_letter' => 'required|file|max:7000', // max 7MB
        ]);
        $employee = Employee::where('id', $request->employeeIDIn)->where('password', $request->password)->first();
        if (!$employee) {
            return response()->json('Fail', 400);
        }
        // return config('app.url');
        // if($request->effective_date){
        //     $date = explode('/', $request->effective_date);
        //     $date = $date[2].'-'.$date[2].'-'.$date[0];
        //     $request->effective_date = $date;
        // }
        $offboardingTicket = new Offboarding;
        $offboardingTicket->employee_id = $request->employeeIDIn;
        $offboardingTicket->type = "Resign";
        $offboardingTicket->status = "0";
        $offboardingTicket->effective_date = $request->effective_date;
        $offboardingTicket->token = Str::random(64);
        $offboardingTicket->save();

        $offboardingDetail = new OffboardingDetail;
        $offboardingDetail->offboarding_id = $offboardingTicket->id;
        $offboardingDetail->reason = $request->reason;
        if ($request->file('resign_letter')) {
            $file = $request->file('resign_letter');
            $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
            $fileName = $offboardingTicket->employee->name.'-'.$fileHash . '.' . $file->getClientOriginalExtension();
            $path = Storage::putFileAs(
                'public/Documents/Resign Letter',
                $request->file('resign_letter'),
                $fileName
            );
            $offboardingDetail->resignation_letter_link = config('app.url') . Storage::url($path);
        }
        $offboardingTicket->details()->save($offboardingDetail);
        $checkpoint = new OffboardingCheckpoint();
        $offboardingTicket->checkpoint()->save($checkpoint);
        $exitClearance = new ExitClearance();
        $offboardingTicket->checkpoint()->save($exitClearance);
        // return response()->json($offboardingTicket);

        // return response()->json("sengsong");

        $par1 = "1";
        $par2 = "text2";
        $par3 = "text3";
        // $input = '{"employeeNameIn":"' . $par1 . '",
        //     "in_par2":"' . $par2 . '",
        //     "in_par3":"' . $par3 . '"}';
        $input = array(
            'employeeIDIn' => $request->employeeIDIn,
            'processTypeIn' => $request->process_type,
            'offboardingIDIn' => $offboardingTicket->id,
        );
        $input = json_encode($input);
        // $input = '{"employeeIDIn":"' . $request->employeeIDIn . '",}';
        // $input = json_encode($request->all());

        // return gettype($input);
        // return json_encode($request->all());

        //Start the process with parameters
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
        $offboardingTicket = Offboarding::find($request->offboardingID);
        // $offboardingTicket->status = $request->status;
        // $offboardingTicket->save();
        if ($request->employee == '1') {
            $offboardingTicket->checkpoint->acc_employee = $request->status == '1' ? true : false;
        } else {
            $offboardingTicket->checkpoint->acc_svp = $request->status == '1' ? true : false;
            $offboardingTicket->effective_date = $request->effective_date;
        }
        $offboardingTicket->push();
        $offboardingTicket->save();

        // $offboardingTicket = Offboarding::find($request->offboardingID);
        if ($offboardingTicket->checkpoint->acc_employee == true && $offboardingTicket->checkpoint->acc_svp == true) {
            $offboardingTicket->status = "2";
            // $offboardingTicket->token = Str::random(64);
            $offboardingTicket->save();

            $input = array(
                'processTypeIn' => 2,
                'offboardingIDIn' => $offboardingTicket->id,
            );
            $input = json_encode($input);
            $this->startProcess($input);
        } elseif ($offboardingTicket->checkpoint->acc_employee == false && $offboardingTicket->checkpoint->acc_svp == false) {
            $offboardingTicket->status = "-2";
            $offboardingTicket->save();
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
            $fileName = $offboardingTicket->employee->name.'-'.$fileHash . '.' . $file->getClientOriginalExtension();

            $path = Storage::putFileAs(
                'public/Documents/Exit Clearance',
                $request->file('file'),
                $fileName
            );
            $docLink = config('app.url') . Storage::url($path);
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
            $offboardingTicket->push();
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
            }
            if (
                $offboardingTicket->checkpoint->acc_fastel == true &&
                $offboardingTicket->checkpoint->acc_kopindosat == true &&
                // $offboardingTicket->checkpoint->acc_it == true &&
                $offboardingTicket->checkpoint->acc_hrdev == true &&
                $offboardingTicket->checkpoint->acc_medical == true &&
                $offboardingTicket->checkpoint->acc_finance == true
            ) {
                $input = array(
                    'processTypeIn' => 3,
                    'offboardingIDIn' => $request->offboardingID,
                    // 'IN_processPayroll' => 1
                    // 'IN_item' => $request->item,
                    // 'IN_dept' => $request->dept,
                    // 'IN_qty' => $request->qty,
                    // 'IN_items' => json_decode($items),
                );
                $input = json_encode($input);
                $this->startProcess($input);
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
                        break;
                    case 'hrss_it':
                        $offboardingTicket->checkpoint->return_hrss_it = true;
                        break;
                    default:
                        # code...
                        break;
                }
                $offboardingTicket->push();
                if (
                    $offboardingTicket->checkpoint->return_svp == true &&
                    $offboardingTicket->checkpoint->return_hrss_softfile == true &&
                    $offboardingTicket->checkpoint->return_hrss_it == true
                ) {
                    $offboardingTicket->status = "6";
                    $offboardingTicket->save();
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
            }
        } else {
            $offboardingTicket->status = "5";
            $offboardingTicket->save();

            if ($request->file('signedDocument')) {
                $file = $request->file('signedDocument');
                $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
                $fileName = $offboardingTicket->employee->name.'-'.$fileHash . '.' . $file->getClientOriginalExtension();
                $path = Storage::putFileAs(
                    'public/Documents/Return Data',
                    $request->file('signedDocument'),
                    $fileName
                );
                $signedDocument = config('app.url') . Storage::url($path);
            }
            if ($request->file('formDocument')) {
                $file = $request->file('formDocument');
                $fileHash = str_replace('.' . $file->extension(), '', $file->hashName());
                $fileName = $offboardingTicket->employee->name.'-'.$fileHash . '.' . $file->getClientOriginalExtension();
                $path = Storage::putFileAs(
                    'public/Documents/Return Data',
                    $request->file('formDocument'),
                    $fileName
                );
                $formDocument = config('app.url') . Storage::url($path);
            }
            $offboardingTicket->details->exitDocument = $signedDocument;
            $offboardingTicket->details->returnDocument = $formDocument;
            $offboardingTicket->details->returnType = $request->type;
            $offboardingTicket->push();

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

    public function employeePendingReturnDocument()
    {
        $offboardingPending = Offboarding::where("status", "4")->get();
        $emailList = [];
        foreach ($offboardingPending as $key => $value) {
            $emailList[$key] = $value->employee->email;
        }
        return response()->json($emailList);
    }
}

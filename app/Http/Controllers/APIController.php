<?php

namespace App\Http\Controllers;

use App\Models\Offboarding;
use App\Models\OffboardingDetail;
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
        // $this->validate($request, [
        //     'resign_letter' => 'required|file|max:7000', // max 7MB
        // ]);
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
        if($request->file('resign_letter')){
            $path = Storage::putFile(
                'public/Documents/Resign Letter',
                $request->file('resign_letter'),
            );
            $offboardingDetail->resignation_letter_link = config('app.url').Storage::url($path);
        }
        $offboardingTicket->details()->save($offboardingDetail);
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

    public function postVerifyResignLetter($id,Request $request){

    }

    public function postManagerConfirmation(Request $request){
        $offboardingTicket = Offboarding::find($request->offboardingID);
        $offboardingTicket->status = $request->status == "1" ? "2" : "-2";
        $offboardingTicket->effective_date = $request->effective_date;
        // $offboardingTicket->token = Str::random(64);
        $offboardingTicket->save();

        $input = array(
            'processTypeIn' => 2,
            'offboardingIDIn' => $offboardingTicket->id,
        );
        $input = json_encode($input);
        $this->startProcess($input);

        return response()->json("Success", 200);
    }
    public function postRequestDocument(Request $request){
        // return response()->json($request->all(), 200);
        // $offboardingTicket = Offboarding::find($request->offboardingID);
        // // $offboardingTicket->status = $request->status == "1" ? "2" : "-2";
        // $offboardingTicket->item = $request->item;
        // $offboardingTicket->qty = $request->qty;
        // // $offboardingTicket->token = Str::random(64);
        // $offboardingTicket->save();
        $items = $request->items;
        // $items = array(
        //     'data1',
        //     'data2',
        //     'data3',
        //     'data4',
        // );
        // return response()->json($items, 200);

        $input = array(
            'processTypeIn' => 3,
            'offboardingIDIn' => $request->offboardingID,
            'IN_item' => $request->item,
            'IN_dept' => $request->dept,
            'IN_qty' => $request->qty,
            'IN_items' => json_decode($items),
        );
        $input = json_encode($input);
        $this->startProcess($input);

        return response()->json("Success", 200);
    }
}

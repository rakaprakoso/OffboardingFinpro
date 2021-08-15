<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class APIController extends Controller
{
    private function getAccessToken(){
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

    public function postResignForm(Request $request)
    {
        $par1 = "text1";
        $par2 = "text2";
        $par3 = "text3";
        // $input = '{"employeeNameIn":"' . $par1 . '",
        //     "in_par2":"' . $par2 . '",
        //     "in_par3":"' . $par3 . '"}';
        // $input = '{"employeeNameIn":"' . $par1 . '"}';
        $input = json_encode($request->all());

        // return gettype($input);
        // return json_encode($request->all());
        $auth = $this->getAccessToken();

        //Start the process with parameters
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
            'InputArguments' => $input,
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

        do {
            sleep(5);
            //Check the status of the process
            $url = 'https://platform.uipath.com/presiaykbmhx/Indosat/odata/Jobs?$filter=Id%20eq%20' . $procid;
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json', 'X-UIPATH-TenantName: YOUR TENANTNAME', 'Authorization: Bearer ' . $auth, 'User-Agent: telnet'));

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 60);

            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $result = curl_exec($ch);
            curl_close($ch);

            $obj = json_decode($result);
            //echo $obj->value[0]->State;
            if (substr($obj->value[0]->State, 0, 4) === "Succ") {
                echo $obj->value[0]->OutputArguments;
                $waitloop = false;
            }
        } while ($waitloop);
        echo "test";
    }
}

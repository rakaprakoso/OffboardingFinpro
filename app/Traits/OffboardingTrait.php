<?php

namespace App\Traits;

use App\Models\Offboarding;
use App\Models\OffboardingDetail;
use App\Models\OffboardingCheckpoint;
use App\Models\ExitClearance;
use App\Models\OffboardingAttachment;
use App\Models\OffboardingForm;
use App\Models\OffboardingInputToken;

use Illuminate\Support\Str;

trait OffboardingTrait
{
    public function newOffboarding($request, $employeeID){
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
        // $checkpoint->acc_document = true;
        // $checkpoint->acc_employee = true;
        if ($offboardingTicket->type_id != "e202" && $offboardingTicket->type_id != "e201") {
            $checkpoint->acc_employee = true;
            $checkpoint->acc_svp = true;
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
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Offboarding;
use App\Traits\PDFTrait;

class OffboardingController extends Controller
{
    use PDFTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $offboarding = Offboarding::with('Employee')->get();
        return response()->json($offboarding, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        if ($request->type == 'full') {
            $offboarding = Offboarding::with('Employee', 'Details', 'offboardingForm')->find($id);
        } else {
            if ($request->progress == "true") {
                $offboarding = Offboarding::with('progressRecord', 'exitClearance', 'Details','comments','offboardingForm')->find($id);
                $offboarding->payroll = $this->exitPayroll($offboarding);
                // return response()->json($offboarding, 200);
            } else {
                $offboarding = Offboarding::with('Employee', 'exitClearance','Details')->find($id);
            }
        }
        return response()->json($offboarding, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // return "test";
        // return $request->all();
        $offboardingTicket = Offboarding::find($id);
        // $offboardingTicket->status = $request->status;

        // $offboardingTicket->save();
        if ($request->document == 'true') {
            $offboardingTicket->checkpoint->acc_document = $request->status == '1' ? '1' : '0';
        }
        if ($request->type == 'exitInterview') {
            $rawInterviewTime = explode(" ", $request->interviewTime);
            $interviewDate = explode("/", $rawInterviewTime[0]);
            $interviewTime = $interviewDate[2] . '-' . $interviewDate[1] . '-' . $interviewDate[0] . ' ' . $rawInterviewTime[1];
            $offboardingTicket->details->exit_interview_time = $interviewTime;
        }
        // $offboardingTicket->save();
        $offboardingTicket->push();
        return response()->json($offboardingTicket, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

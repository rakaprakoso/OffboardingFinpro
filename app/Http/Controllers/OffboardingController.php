<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Offboarding;

class OffboardingController extends Controller
{
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
        if ($request->progress == "true") {
            $offboarding = Offboarding::with('progressRecord','Details')->find($id);
        }else{
            $offboarding = Offboarding::with('Employee', 'Details')->find($id);
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
        $offboardingTicket->status = $request->status;
        $offboardingTicket->save();
        if ($request->document == 'true') {
            $offboardingTicket->checkpoint->acc_document = $request->status == '1' ? '1' : '0';
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

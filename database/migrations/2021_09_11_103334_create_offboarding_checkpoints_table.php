<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingCheckpointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_checkpoints', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            // $table->boolean('acc_document')->nullable();
            $table->boolean('acc_employee')->nullable();
            $table->boolean('acc_svp')->nullable();
            $table->boolean('acc_hrbp_mgr')->nullable();
            // $table->boolean('acc_hrss_mgr')->nullable();
            $table->boolean('exit_interview')->nullable();
            $table->boolean('confirm_fastel')->nullable();
            $table->boolean('confirm_kopindosat')->nullable();
            $table->boolean('confirm_it')->nullable();
            $table->boolean('confirm_hrdev')->nullable();
            $table->boolean('confirm_medical')->nullable();
            $table->boolean('confirm_finance')->nullable();
            $table->boolean('return_to_svp')->nullable();
            $table->boolean('return_to_hrss_doc')->nullable();
            $table->boolean('return_to_hrss_it')->nullable();
            $table->boolean('confirm_payroll')->nullable();
            $table->boolean('confirm_exit_document')->nullable();
            $table->boolean('payroll_calculation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offboarding_checkpoints');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeBooleanToIntegerCheckpoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_checkpoints', function (Blueprint $table) {
            $table->integer('acc_employee')->nullable()->change();
            $table->integer('acc_svp')->nullable()->change();
            $table->integer('acc_hrbp_mgr')->nullable()->change();
            // $table->integer('acc_hrss_mgr')->nullable()->change();
            $table->integer('exit_interview')->nullable()->change();
            $table->integer('confirm_fastel')->nullable()->change();
            $table->integer('confirm_kopindosat')->nullable()->change();
            $table->integer('confirm_it')->nullable()->change();
            $table->integer('confirm_hrdev')->nullable()->change();
            $table->integer('confirm_medical')->nullable()->change();
            $table->integer('confirm_finance')->nullable()->change();
            $table->integer('return_to_svp')->nullable()->change();
            $table->integer('return_to_hrss_doc')->nullable()->change();
            $table->integer('return_to_hrss_it')->nullable()->change();
            $table->integer('confirm_payroll')->nullable()->change();
            $table->integer('confirm_exit_document')->nullable()->change();
            $table->integer('payroll_calculation')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offboarding_checkpoints', function (Blueprint $table) {
            $table->boolean('acc_employee')->nullable()->change();
            $table->boolean('acc_svp')->nullable()->change();
            $table->boolean('acc_hrbp_mgr')->nullable()->change();
            // $table->boolean('acc_hrss_mgr')->nullable()->change();
            $table->boolean('exit_interview')->nullable()->change();
            $table->boolean('confirm_fastel')->nullable()->change();
            $table->boolean('confirm_kopindosat')->nullable()->change();
            $table->boolean('confirm_it')->nullable()->change();
            $table->boolean('confirm_hrdev')->nullable()->change();
            $table->boolean('confirm_medical')->nullable()->change();
            $table->boolean('confirm_finance')->nullable()->change();
            $table->boolean('return_to_svp')->nullable()->change();
            $table->boolean('return_to_hrss_doc')->nullable()->change();
            $table->boolean('return_to_hrss_it')->nullable()->change();
            $table->boolean('confirm_payroll')->nullable()->change();
            $table->boolean('confirm_exit_document')->nullable()->change();
            $table->boolean('payroll_calculation')->nullable()->change();
        });
    }
}

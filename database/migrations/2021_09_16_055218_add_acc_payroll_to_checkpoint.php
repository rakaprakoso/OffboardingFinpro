<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAccPayrollToCheckpoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_checkpoints', function (Blueprint $table) {
            $table->boolean('acc_payroll')->nullable();
            $table->boolean('acc_hrss')->nullable();
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
            $table->dropColumn('acc_payroll');
            $table->dropColumn('acc_hrss');
        });
    }
}

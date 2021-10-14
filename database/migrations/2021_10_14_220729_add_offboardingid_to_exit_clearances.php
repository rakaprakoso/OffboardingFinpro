<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOffboardingidToExitClearances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_clearances', function (Blueprint $table) {
            $table->bigInteger('offboarding_id')->unsigned()->nullable()->after('employee_id');
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exit_clearances', function (Blueprint $table) {
            $table->dropColumn('offboarding_id');
        });
    }
}

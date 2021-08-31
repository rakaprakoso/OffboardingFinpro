<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExitInterviewDoneToOffboarding extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboardings', function (Blueprint $table) {
            $table->boolean('ExitInterviewDone')->nullable()->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offboardings', function (Blueprint $table) {
            $table->dropColumn('ExitInterviewDone');
        });
    }
}

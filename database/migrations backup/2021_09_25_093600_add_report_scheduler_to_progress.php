<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReportSchedulerToProgress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('progress_records', function (Blueprint $table) {
            $table->boolean('reminder')->nullable();
            $table->string('process_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('progress_records', function (Blueprint $table) {
            $table->dropColumn('reminder');
            $table->dropColumn('process_type');
        });
    }
}

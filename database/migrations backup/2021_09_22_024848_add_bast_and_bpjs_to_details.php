<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBastAndBpjsToDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_details', function (Blueprint $table) {
            $table->string('bast_attachment')->nullable();
            $table->string('bpjs_attachment')->nullable();
            $table->string('job_tranfer_attachment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offboarding_details', function (Blueprint $table) {
            $table->dropColumn('bast_attachment');
            $table->dropColumn('bpjs_attachment');
            $table->dropColumn('job_tranfer_attachment');
        });
    }
}

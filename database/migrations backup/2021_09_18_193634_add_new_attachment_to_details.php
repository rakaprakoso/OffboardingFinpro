<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewAttachmentToDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_details', function (Blueprint $table) {
            $table->string('exit_interview_form')->nullable();
            $table->string('note_procedure')->nullable();
            $table->string('change_opers')->nullable();
            $table->string('paklaring')->nullable();
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
            $table->dropColumn('exit_interview_form');
            $table->dropColumn('note_procedure');
            $table->dropColumn('change_opers');
            $table->dropColumn('paklaring');
        });
    }
}

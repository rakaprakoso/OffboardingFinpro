<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_attachments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->text('resignation_letter_link')->nullable();
            $table->text('exit_interview_form_link')->nullable();
            $table->text('cv_link')->nullable();
            $table->text('personnel_letter_link')->nullable();
            $table->text('clearing_document_link')->nullable();
            $table->text('termination_letter_link')->nullable();
            $table->text('payroll_link')->nullable();
            $table->text('return_document_link')->nullable();
            $table->text('change_opers_link')->nullable();
            $table->text('change_bpjs_link')->nullable();
            $table->text('bast_link')->nullable();
            $table->text('job_transfer_link')->nullable();
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
        Schema::dropIfExists('offboarding_attachments');
    }
}

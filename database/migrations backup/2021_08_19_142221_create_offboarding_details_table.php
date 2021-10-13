<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_details', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->dateTime('exit_interview_time')->nullable();
            $table->text('resignation_letter_link')->nullable();
            $table->text('exit_interview_link')->nullable();
            $table->text('employee_CV_link')->nullable();
            $table->text('personnel_letter_link')->nullable();
            $table->text('reference_letter_link')->nullable();
            $table->text('termination_letter_link')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offboarding_details');
    }
}

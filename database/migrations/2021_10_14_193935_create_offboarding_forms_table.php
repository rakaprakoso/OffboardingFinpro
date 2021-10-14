<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_forms', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->jsonb('exit_interview_form')->nullable();
            $table->jsonb('return_document_form')->nullable();
            $table->jsonb('other_dept_form')->nullable();
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
        Schema::dropIfExists('offboarding_forms');
    }
}

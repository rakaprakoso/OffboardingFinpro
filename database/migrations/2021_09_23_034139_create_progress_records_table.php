<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgressRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('progress_records', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->boolean('status')->nullable();
            $table->boolean('uipath')->nullable();
            $table->text('message')->nullable();
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
        Schema::dropIfExists('progress_records');
    }
}

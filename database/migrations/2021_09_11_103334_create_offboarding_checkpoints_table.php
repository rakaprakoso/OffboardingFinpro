<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingCheckpointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_checkpoints', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->boolean('acc_document')->nullable();
            $table->boolean('acc_employee')->nullable();
            $table->boolean('acc_svp')->nullable();
            $table->boolean('acc_hrbp_mgr')->nullable();
            $table->boolean('acc_hrss_mgr')->nullable();
            $table->boolean('acc_fastel')->nullable();
            $table->boolean('acc_kopindosat')->nullable();
            $table->boolean('acc_it')->nullable();
            $table->boolean('acc_hrdev')->nullable();
            $table->boolean('acc_medical')->nullable();
            $table->boolean('acc_finance')->nullable();
            $table->boolean('return_svp')->nullable();
            $table->boolean('return_hrss_softfile')->nullable();
            $table->boolean('return_hrss_it')->nullable();
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
        Schema::dropIfExists('offboarding_checkpoints');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffboardingInputTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offboarding_input_tokens', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable()->unique();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->string('fastel')->nullable();
            $table->string('kopindosat')->nullable();
            $table->string('it')->nullable();
            $table->string('hrdev')->nullable();
            $table->string('medical')->nullable();
            $table->string('finance')->nullable();
            $table->string('svp')->nullable();
            $table->string('hrss_doc')->nullable();
            $table->string('hrss_it')->nullable();
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
        Schema::dropIfExists('offboarding_input_tokens');
    }
}

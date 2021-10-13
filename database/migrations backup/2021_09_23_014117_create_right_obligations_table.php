<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRightObligationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('right_obligations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('offboarding_id')->unsigned()->nullable();
            $table->foreign('offboarding_id')->references('id')->on('offboardings')->onDelete('cascade');
            $table->jsonb('it')->nullable();
            $table->jsonb('fastel')->nullable();
            $table->jsonb('kopindosat')->nullable();
            $table->jsonb('finance')->nullable();
            $table->jsonb('medical')->nullable();
            $table->jsonb('hrdev')->nullable();
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
        Schema::dropIfExists('right_obligations');
    }
}

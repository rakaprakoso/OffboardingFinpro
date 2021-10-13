<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSignedAndReturnDocumentToDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_details', function (Blueprint $table) {
            $table->string('exitDocument')->nullable();
            $table->string('returnDocument')->nullable();
            $table->string('returnType')->nullable();
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
            $table->dropColumn('exitDocument');
            $table->dropColumn('returnDocument');
            $table->dropColumn('returnType');
        });
    }
}

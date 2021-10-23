<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmployeeReturnDocumentToCheckpoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offboarding_checkpoints', function (Blueprint $table) {
            $table->after('confirm_payroll', function ($table) {
                $table->boolean('employee_return_document')->nullable();
                // $table->string('address_line1');
                // $table->string('address_line2');
                // $table->string('city');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offboarding_checkpoints', function (Blueprint $table) {
            $table->dropColumn('employee_return_document');
        });
    }
}

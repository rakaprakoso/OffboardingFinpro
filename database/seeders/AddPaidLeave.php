<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Employee;

class AddPaidLeave extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        for ($i=1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);
            $employeeData->paid_leave_available = $faker->numberBetween(0,24);
            $employeeData->save();
        }
    }
}

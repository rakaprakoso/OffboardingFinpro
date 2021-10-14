<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Employee;

class UpdateProfilePic extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        for($i = 1;$i<=100;$i++){
            $employee = Employee::find($i);
            $employee->profile_pic = '/storage/Employees/Profile Picture/'.$employee->gender.$faker->numberBetween(1,3).'.jpg';
            $employee->save();
        }
    }
}

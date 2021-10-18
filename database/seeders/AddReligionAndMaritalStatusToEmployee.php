<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Employee;

class AddReligionAndMaritalStatusToEmployee extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        $religions = [
            'Islam',
            'Kristen',
            'Katolik',
            'Buddha',
            'Hindu',
            'Konghucu',
        ];
        $marital_status = ['Married','Non Married'];
        for ($i=1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);
            $employeeData->religion = $religions[$faker->numberBetween(0,count($religions)-1)];
            $employeeData->marital_status = $marital_status[$faker->numberBetween(0,count($marital_status)-1)];
            $employeeData->save();
        }
    }
}

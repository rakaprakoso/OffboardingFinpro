<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Faker\Factory as Faker;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        for($i = 1;$i<50;$i++){
            \DB::table('employees')->insert([
                'name' => $faker->name,
                'phone' => $faker->phoneNumber,
                'email' => $faker->email,
                'birth_date' => $faker->dateTimeBetween($startDate = '-56 years', $endDate = '-25 years', $timezone = null),
                'work_start_date' => $faker->dateTimeBetween($startDate = '-20 years', $endDate = '-1 years', $timezone = null),
            ]);
        }
    }
}

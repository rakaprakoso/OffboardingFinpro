<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EmployeeAttribute extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        for($i = 1;$i<=10;$i++){
            \DB::table('locations')->insert([
                'id' => $i,
                'address' => $faker->streetAddress ,
                'city' => $faker->city,
            ]);
        }

        $departments = [
            'Customer Care',
            'Teknologi',
            'Pemasaran',
            'B2B',
            'Strategy',
            'Penjualan',
            'Graduate Opportunities',
            'Consumer',
        ];
        for($i = 1;$i<=count($departments);$i++){
            for ($j=0; $j < 3; $j++) {
                \DB::table('departments')->insert([
                    'id' => (($i-1)*3)+($j+1),
                    'name' => $departments[$i-1],
                    'manager_id' => 90 + $faker->numberBetween(1,10),
                    'hr_svp_id' => 80 + $faker->numberBetween(1,10),
                    'location_id' =>$faker->numberBetween(1,10),
                ]);
            }
        }

        $jobs = [
            'Staff',
            'Operational',
            'Engineer',
            'Senior Engineer',
            'Team Leader',
            'Specialist',
            'Assistant Manager',
            'Manager',
            'Senior Manager',
            'Director',
        ];
        for($i = 1;$i<=count($jobs);$i++){
            $min_salary = $faker->numberBetween(50,80) * ($i*0.6);
            $max_salary = $faker->numberBetween($min_salary+10,$min_salary+50);
            \DB::table('jobs')->insert([
                'id' => $i,
                'title' => $jobs[$i-1],
                'min_salary' => $min_salary * 100000,
                'max_salary' => $max_salary * 100000,
            ]);
        }
    }
}

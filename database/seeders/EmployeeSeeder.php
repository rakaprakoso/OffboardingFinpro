<?php

namespace Database\Seeders;

use App\Models\Job;
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
        for($i = 1;$i<=100;$i++){
            $hire_date = $faker->dateTimeBetween($startDate = '-20 years', $endDate = '-1 years', $timezone = null);
            $birth_date = $faker->dateTimeBetween($startDate = '-56 years', $endDate = '-25 years', $timezone = null);
            $job_id = $faker->numberBetween(1,5);
            $manager_id = $faker->numberBetween(61, 80);
            if ($i>60) {
                $manager_id = $faker->numberBetween(91, 99);
                $job_id = $faker->numberBetween(6,8);
                if ($i>90) {
                    $job_id = $faker->numberBetween(9,10);
                    $manager_id = 100;
                }
            }
            $rangeSalary = Job::where('id', $job_id)->first();
            $salary = $faker->numberBetween($rangeSalary->min_salary, $rangeSalary->max_salary);
            $gender = ['male','female'];
            \DB::table('employees')->insert([
                'id' => $i,
                'nik' => $i,
                'name' => $faker->name,
                'email' => 'user'.$i.'@getnada.com',
                'phone' => $faker->phoneNumber,
                'hire_date' => $hire_date,
                'job_id' => $job_id,
                'salary' => $salary,
                'manager_id' => $manager_id,
                'department_id' => $faker->numberBetween(1, 24),
                'profile_pic' => '/images/employees/'.$faker->numberBetween(1, 5).'.jpg',
                'gender' => $gender[$faker->numberBetween(0, 1)],
                'address' => $faker->address,
                'ktp' => $faker->randomNumber(8) . $faker->randomNumber(8),
                'birth_date' => $birth_date,
                'birth_place' => $faker->city,
                'password' => 'password'.$i,
            ]);
        }
    }
}

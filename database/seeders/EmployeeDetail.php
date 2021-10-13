<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EmployeeDetail extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        for ($i = 1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);

            $diff_in_years = now()->diffInYears($employeeData->hire_date);
            $maxNum = ceil($diff_in_years / 2);
            $minNum =1;
            if ($diff_in_years>10) {
                $minNum =6;
            }elseif ($diff_in_years>5){
                $minNum =3;
            }
            $variants = $faker->numberBetween($minNum, $maxNum);

            $startDate = $employeeData->hire_date;
            for ($j = 0; $j < $variants; $j++) {
                $job_id = $faker->numberBetween(1, 10);
                $department_id = $faker->numberBetween(0, 2) * 8 + $faker->numberBetween(1, 8);
                if ($j == 0) {
                    $endDate = null;
                }
                if ($j > 0) {
                    $startDate = $endDate;
                }
                if ($variants == 1) {
                    $endDate = null;
                    $job_id =  $employeeData->job_id;
                    $department_id =  $employeeData->department_id;
                } else {
                    $endDate = $faker->dateTimeInInterval($faker->dateTimeInInterval($startDate,'+24 months'), '+ 24 months');
                }
                if ($j + 1 == $variants) {
                    $endDate = null;
                    $job_id =  $employeeData->job_id;
                    $department_id =  $employeeData->department_id;
                }


                \DB::table('job_histories')->insert([
                    'employee_id' => $i,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'job_id' => $job_id,
                    'department_id' => $department_id,
                ]);
            }
        }
    }
}

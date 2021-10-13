<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Employee;

class EmployeeNonFormalAndAward extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        $course_name = [
            'SkillUp',
            'Disruptor Training',
            'No-Bull Bootcamp',
            'Mentee to Mentor',
            'Active Achievement',
            'Excel and Elevate Training',
            'Practice to Perfect',
            'Strive Training',
            'Commission Kings',
            'Get it, Sell it Workshop',
            'Productivity Today',
            'Mo-Money Masterclass',
            'Impact Training',
            'Excalibur Training',
            'PerfectPitch Sales Training',
            'Unbound Opportunities',
            'Road-to-Success Workshop',
            'Passion Chasers',
            'Limitless Horizons',
            'Alpha Entrepreneurs Workshop',
        ];

        for ($i=1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);
            $rawYear = strtotime($employeeData->hire_date);
            // $year = date('Y',$rawYear) + $faker->numberBetween(20,26);
            $courseVariants = $faker->numberBetween(0,count($course_name) -1);
            for ($j=0; $j <$courseVariants; $j++) {
                \DB::table('non_formal_education')->insert([
                    'employee_id' => $i,
                    'course_name' => $course_name[$faker->numberBetween(0,$courseVariants)],
                    'location' => $faker->city,
                    'date' => $faker->dateTimeBetween(date('Y-m-d',$rawYear), 'now'),
                ]);
            }

        }

        $award_name = [
            'Superstar Award',
            'Prime Player Award',
            'Shining Star Award',
            'Always Timely Award',
            'Perfectly Present Award',
            'Happy Everyday Award',
            'League Of Superheroes',
            'The Dream Team',
            'The Fist Bump Award',
            'Customer Success Champions',
            'Peace in the Chaos',
            'Distributor of smiles',
            'Bestower of Energy',
            'Ultimate Team Player',
            'Everyday Hero Award',
        ];

        for ($i=1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);
            $rawYear = strtotime($employeeData->hire_date);

            $awardYear = floor((date('Y') - date('Y',$rawYear)) / 5);
            for ($j=0; $j < $awardYear; $j++) {
                \DB::table('achievements')->insert([
                    'employee_id' => $i,
                    'award_name' => 'Masa Kerja ' . ($j+1)*5 .' Tahun',
                    // 'location' => $faker->city,
                    'date' => date('Y-m-d H:i:s',strtotime('+'.($j+1)*5 .' years',$rawYear)),
                ]);
            }

            $awardVariant = $faker->numberBetween(0,(count($award_name) -1)/3);
            for ($j=0; $j <$awardVariant; $j++) {
                // echo 'id : '.$i.' | ';
                // echo ($j*3) + $faker->numberBetween(0,2) . " | ";
                // echo $award_name[($j*3) + $faker->numberBetween(0,2)];
                \DB::table('achievements')->insert([
                    'employee_id' => $i,
                    'award_name' => $award_name[($j*3) + $faker->numberBetween(0,2)],
                    // 'location' => $faker->city,
                    'date' => $faker->dateTimeBetween(date('Y-m-d',$rawYear), 'now'),
                ]);
            }
            // echo ' - ';

        }

    }
}

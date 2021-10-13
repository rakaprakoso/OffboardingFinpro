<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Employee;

class EmployeeCVData extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID');
        $universities = [
            'Universitas Gadjah Mada',
            'Universitas Indonesia',
            'Universitas Pendidikan Indonesia', 'Universitas Diponegoro', 'Universitas Brawijaya', 'Universitas Negeri Yogyakarta', 'Universitas Lampung', 'Universitas Airlangga', 'Institut Pertanian Bogor ', 'Universitas Negeri Semarang', 'Universitas Muhammadiyah Surakarta ', 'Institut Teknologi Bandung ', 'Universitas Negeri Malang ', 'Universitas Sumatera Utara ', 'Universitas Muhammadiyah Yogyakarta ', 'Universitas Bina Nusantara ', 'Universitas Telkom ', 'Institut Teknologi Sepuluh Nopember ', 'Universitas Jember ', 'Universitas Udayana ', 'Universitas Islam Negeri Maulana Malik Ibrahim Malang ', 'Universitas Andalas 2', 'Universitas Sebelas Maret ', 'Universitas Hasanuddin ', 'Universitas Islam Negeri Syarif Hidayatullah Jakarta ', 'Universitas Muhammadiyah Malang ', 'Universitas Islam Negeri Sunan Ampel Surabaya ', 'Universitas Islam Indonesia ', 'Universitas Islam Negeri Walisongo ', 'Universitas Islam Negeri Sulthan Syarif Kasim Riau ', 'Universitas Pasundan ', 'Universitas Negeri Surabaya ', 'Universitas Syiah Kuala ', 'Universitas Mercu Buana',
        ];
        $major = [
            'Teknik Informatika',
            'Ilmu Komputer',
            'Teknik Komputer',
            'Sistem Informasi',
            'Sistem Informasi',
            'Manajemen Informasi',
            'Hubungan Internasional',
            'Ilmu Komunikasi',
            'Psikologi',
            'Bisnis dan Manajemen',
            'Akuntansi',
            'Ekonomi',
            'Desain Komunikasi Visual',
        ];
        $level = [
            'SMA',
            'SMP',
            'SD',
        ];

        for ($i = 1; $i <= 100; $i++) {
            $employeeData = Employee::find($i);
            $rawYear = strtotime($employeeData->birth_date);
            $year = date('Y',$rawYear) + $faker->numberBetween(20,26);
            for ($j = 1; $j <= 4; $j++) {
                $institute = $universities[$faker->numberBetween(0, count($universities) - 1)];
                $selectedMajor = $major[$faker->numberBetween(0, count($major) - 1)];
                $establishment = 'S1';
                if ($j>1) {
                    $institute = $level[$j-2]. ' '.$faker->numberBetween(1,8).' '.$faker->city;
                    $selectedMajor = null;
                    $establishment = null;
                    if ($j==2) {
                        $year = date('Y',$rawYear) + $faker->numberBetween(17,19);
                    }
                    if ($j==4) {
                        $year = $year - 6;
                    }elseif ($j==3) {
                        $year = $year - 3;
                    }
                }
                \DB::table('education')->insert([
                    'employee_id' => $i,
                    'institute' => $institute,
                    'major' => $selectedMajor,
                    'year_graduation' => $year,
                    'establishment' => $establishment,
                ]);
            }
        }
    }
}

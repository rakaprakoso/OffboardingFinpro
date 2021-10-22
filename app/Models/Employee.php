<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $with = ['job_detail','department'];
    public function exitClearance()
    {
        return $this->hasOne(ExitClearance::class, 'employee_id','id');
    }
    public function job_detail()
    {
        return $this->hasOne(Job::class, 'id','job_id');
    }
    public function department()
    {
        return $this->hasOne(Department::class, 'id','department_id');
    }
    public function job_history()
    {
        return $this->hasMany(JobHistory::class, 'employee_id','id')->orderBy('start_date','desc');
    }
    public function formal_education()
    {
        return $this->hasMany(Education::class, 'employee_id','id')->orderBy('year_graduation','desc');
    }
    public function non_formal_education()
    {
        return $this->hasMany(NonFormalEducation::class, 'employee_id','id')->orderBy('date','desc');
    }
    public function achievements()
    {
        return $this->hasMany(Achievement::class, 'employee_id','id')->orderBy('date','desc');
    }
}

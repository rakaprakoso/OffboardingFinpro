<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobHistory extends Model
{
    use HasFactory;
    protected $with = ['job_detail','department'];
    public function department()
    {
        return $this->hasOne(Department::class, 'id','department_id');
    }
    public function job_detail()
    {
        return $this->hasOne(Job::class, 'id','job_id');
    }

}

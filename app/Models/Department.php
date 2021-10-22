<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $with = ['location'];
    public function location()
    {
        return $this->hasOne(Location::class, 'id','location_id');
    }
    public function svp()
    {
        return $this->hasOne(Employee::class, 'id','hr_svp_id');
    }
}

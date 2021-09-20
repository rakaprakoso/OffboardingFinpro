<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offboarding extends Model
{
    use HasFactory;
    // protected $guarded = array();

    // public static $rules = array();

    // public $relationships = array('Author', 'Category');

    // public function author() {
    //     return $this->belongsTo('Author');
    // }

    // public function category() {
    //     return $this->belongsTo('Category');
    // }

    protected $with = ['employee','checkpoint','exitClearance','statusDetails','typeDetail'];

    public function employee()
    {
        return $this->hasOne(Employee::class, 'id','employee_id');
    }
    public function details()
    {
        return $this->hasOne(OffboardingDetail::class, 'offboarding_id','id');
    }
    public function typeDetail()
    {
        return $this->hasOne(TypeDetail::class, 'code','type');
    }
    public function checkpoint()
    {
        return $this->hasOne(OffboardingCheckpoint::class, 'offboarding_id','id');
    }
    public function exitClearance()
    {
        return $this->hasOne(ExitClearance::class, 'offboarding_id','id');
    }
    public function statusDetails()
    {
        return $this->hasOne(StatusDetail::class, 'code','status');
    }
}

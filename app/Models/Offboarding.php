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

    public function employee()
    {
        return $this->hasOne(Employee::class, 'id','employee_id');
    }
    public function details()
    {
        return $this->hasOne(OffboardingDetail::class, 'offboarding_id','id');
    }
}

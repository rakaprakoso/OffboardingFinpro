<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OffboardingCheckpoint extends Model
{
    use HasFactory;
    public function offboarding()
    {
        return $this->hasOne(Offboarding::class, 'id','offboarding_id');
    }
}

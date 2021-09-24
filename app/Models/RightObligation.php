<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RightObligation extends Model
{
    use HasFactory;
    protected $casts = [
        'it' => 'array',
        'fastel' => 'array',
        'kopindosat' => 'array',
        'finance' => 'array',
        'medical' => 'array',
        'hrdev' => 'array',
    ];
}

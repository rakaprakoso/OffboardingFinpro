<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OffboardingForm extends Model
{
    use HasFactory;
    protected $casts = [
        'exit_interview_form' => 'array',
        'return_document_form' => 'array',
        'other_dept_form' => 'array',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerminoBiomicroscopia extends Model
{
    use HasFactory;

    protected $table = 'terminos_biomicroscopia';
    protected $fillable = ['termino'];
}
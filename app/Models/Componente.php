<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Componente extends Model
{
    protected $fillable = ['nombre', 'descripcion'];
    
    public function farmacos()
    {
        return $this->hasMany(Farmaco::class);
    }
}
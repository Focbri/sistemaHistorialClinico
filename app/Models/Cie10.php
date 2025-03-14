<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use function Ramsey\Uuid\v1;

class Cie10 extends Model
{
    use HasFactory;

    protected $table = 'cie10'; // Nombre de la tabla
    protected $fillable = [
        'a00', 
        'a01', 
        'a02', 
        'a03',
        'a04',
        'a05',
        'a06',
        'a07',
        'a08',
        'a09',
        'a15',
    ]; // Columnas que se pueden llenar
}
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cie10 extends Model
{
    use HasFactory;

    protected $table = 'cie10'; // Nombre de la tabla
    protected $fillable = [
        'colera', 
        'fiebres_tifoidea_paratifoidea', 
        'otras_infecciones_debidas_salmonella', 
        'shigelosis']; // Columnas que se pueden llenar
}
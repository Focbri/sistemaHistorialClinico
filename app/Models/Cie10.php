<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Cie10 extends Model
{
    use HasFactory;

    protected $table = 'cie10';
    protected $fillable = [
        'list_01', 'list_otros'
    ];

    public static function getMostUsedCodes($limit = 10)
    {
        // Obtener todos los valores posibles de cie10
        $cie10Values = self::getAllPossibleValues();
        
        // Contar ocurrencias en consultas
        $counts = [];
        foreach ($cie10Values as $value) {
            $count = Consulta::where('impresion_diagnostica', 'like', '%'.$value.'%')->count();
            if ($count > 0) {
                $counts[$value] = $count;
            }
        }
        
        arsort($counts);
        return array_slice($counts, 0, $limit, true);
    }

    public static function getAllPossibleValues()
    {
        $columns = ['list_01', 'list_otros'];
        $allValues = [];
        
        foreach ($columns as $column) {
            $values = self::whereNotNull($column)
                        ->distinct()
                        ->pluck($column)
                        ->toArray();
            $allValues = array_merge($allValues, $values);
        }
        
        return array_unique($allValues);
    }
}
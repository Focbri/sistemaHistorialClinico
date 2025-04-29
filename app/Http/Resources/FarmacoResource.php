<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FarmacoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre_comercial' => $this->nombre_comercial,
            'componente_activo' => $this->componente_activo,
            'presentacion' => $this->presentacion,
            'concentracion' => $this->concentracion,
            'stock' => $this->stock ? [
                'visual' => $this->stock->visual,
                'insamed' => $this->stock->insamed,
                's_p' => $this->stock->s_p,
                'total' => $this->stock->total
            ] : null,
            'stock_total' => $this->stock ? $this->stock->total : 0
        ];
    }
}
<?php

namespace App\Exports;

use App\Models\Cita;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;

class CitasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, WithEvents
{
    protected $citas;
    protected $totalCotizacion;

    public function __construct($citas, $totalCotizacion = null)
    {
        $this->citas = $citas;
        $this->totalCotizacion = $totalCotizacion;
    }

    public function collection()
    {
        return $this->citas;
    }

    public function headings(): array
    {
        return [
            'Fecha/Hora',
            'DNI Paciente',
            'Paciente',
            'Médico',
            'Motivo',
            'Observaciones',
            'Estado',
            'Cotización (S/.)'
        ];
    }

    public function map($cita): array
    {
        $fechaHora = is_string($cita->fecha_hora) 
            ? \Carbon\Carbon::parse($cita->fecha_hora)
            : $cita->fecha_hora;

        return [
            $fechaHora->format('d/m/Y H:i'),
            $cita->paciente->dni ?? 'N/A',
            $cita->paciente->nombre_completo ?? 'N/A',
            $cita->medico->name ?? 'N/A',
            $cita->motivo ?? 'N/A',
            $cita->observaciones ?? 'Ninguna',
            ucfirst($cita->estado),
            $cita->cotizacion ? number_format($cita->cotizacion, 2) : '0.00',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet;
                $lastRow = $sheet->getHighestDataRow();
                
                // Agregar fila de total solo si tenemos el total
                if ($this->totalCotizacion !== null) {
                    $sheet->setCellValue('H'.($lastRow+1), number_format($this->totalCotizacion, 2));
                    $sheet->setCellValue('G'.($lastRow+1), 'TOTAL:');
                    
                    $sheet->getStyle('A'.($lastRow+1).':H'.($lastRow+1))->applyFromArray([
                        'font' => ['bold' => true],
                        'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'F2F2F2']]
                    ]);
                    
                    $sheet->mergeCells('A'.($lastRow+1).':F'.($lastRow+1));
                    
                    $sheet->getStyle('H'.($lastRow+1))
                          ->getNumberFormat()
                          ->setFormatCode('#,##0.00');
                }
            }
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'F2F2F2']]
        ]);

        foreach(range('A', 'H') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $lastDataRow = $this->citas->count() + 1;
        $sheet->getStyle('H2:H' . $lastDataRow)
              ->getNumberFormat()
              ->setFormatCode('#,##0.00');
    }

    public function title(): string
    {
        return 'Reporte de Citas';
    }
}
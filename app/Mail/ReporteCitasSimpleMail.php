<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ReporteCitasSimpleMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reporteData;
    public $excelPath;

    public function __construct($reporteData, $excelPath)
    {
        $this->reporteData = $reporteData;
        $this->excelPath = $excelPath;
    }

    public function build()
    {
        $mail = $this->subject('Reporte Diario de Citas - ' . $this->reporteData['sede'])
            ->markdown('emails.reporte-citas-simple')
            ->with([
                'data' => $this->reporteData,
                'sede' => $this->reporteData['sede'],
                'fecha_reporte' => $this->reporteData['fecha_reporte'],
                'citas' => $this->reporteData['citas'],
                'total_citas' => $this->reporteData['total_citas'],
                'total_cotizacion' => number_format($this->reporteData['total_cotizacion'], 2)
            ]);

        // Adjuntar el archivo Excel si existe
        if (file_exists($this->excelPath)) {
            $mail->attach($this->excelPath, [
                'as' => 'reporte_citas.xlsx',
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);
        }

        return $mail;
    }
}
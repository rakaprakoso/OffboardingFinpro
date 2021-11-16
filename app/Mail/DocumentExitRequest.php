<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DocumentExitRequest extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($offboardingData, $type = 1, $options = null)
    {
        $this->offboardingData = $offboardingData;
        $this->type = $type;
        $this->options = $options;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "Document Exit Request";
        switch ($this->type) {
            case '1':
                $subject = "Document Exit Request";
                break;
            case '2':
                $subject = "Information Exit Employee";
                break;
            case '3':
                $subject = "Approval Exit Interview Form";
                break;
            case '4':
                $subject = "Info Pengembalian Barang dan Dokumen";
                break;
            case '5':
                $subject = "Approval Payroll Employee";
                break;
            default:
                break;
        }

        return $this->from('noreply@deprakoso.site', 'HR Info')
            ->subject('[OFFBOARDING]'. $subject . ' - '.$this->offboardingData->employee->name)
            ->view('emails.documentExitRequest')
            ->with('offboardingData', $this->offboardingData)
            ->with('subject', $subject)
            ->with('options', $this->options)
            ->with('type', $this->type);
    }
}

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
    public function __construct($offboardingData, $type = 1, ...$options)
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
                $subject = "Request Complete Document";
                break;
            case '2':
                $subject = "Request Approval HR MGR";
                break;
            case '3':
                $subject = "Request Update Exit Interview";
                break;
            default:
                break;
        }

        return $this->from('noreply@indosat.com', 'noreply')
            ->subject($subject)
            ->view('emails.documentExitRequest')
            ->with('offboardingData', $this->offboardingData)
            ->with('subject', $subject)
            ->with('options', $this->options)
            ->with('type', $this->type);
    }
}

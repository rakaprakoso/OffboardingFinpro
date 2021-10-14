<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeeClearDocument extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($offboardingData, $type = 1, $messageEmail,...$options)
    {
        $this->offboardingData = $offboardingData;
        $this->type = $type;
        $this->messageEmail = $messageEmail;
        $this->options = $options;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // echo $this->message;
        $subject = "Document Exit Request";
        switch ($this->type) {
            case '1':
                ##EXIT INTERVIEW FORM to SVP
                $subject = "Exit Interview Form Approval";
                break;
            case '2':
                $subject = "Exit Clearance Check from Employee";
                break;
            case '3':
                $subject = "Return Document Note";
                break;
            case '4':
                $subject = "Offboarding Complete";
                break;
            case '5':
                $subject = "Payment";
                break;
            default:
                break;
        }

        return $this->from('noreply@deprakoso.site', 'HR Info')
            ->subject('[OFFBOARDING] '. $subject . ' - '.$this->offboardingData->employee->name)
            ->view('emails.employeeClearDocument')
            ->with('offboardingData', $this->offboardingData)
            ->with('messageEmail', $this->messageEmail)
            ->with('subject', $subject)
            ->with('options', $this->options)
            ->with('type', $this->type);
    }
}

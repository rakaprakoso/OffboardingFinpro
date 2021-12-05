<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResignationRequest extends Mailable
{
    use Queueable, SerializesModels;
    protected $data;
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
        $subject = "Resign Request";
        switch ($this->type) {
            case '1':
                $subject = "Resignation Request Approval";
                break;
            case '2':
                $subject = "Confirm Your Resignation";
                break;
            case '3':
                $subject = "Resignation Approved";
                break;
            case '4':
                $subject = "Resignation Approved";
                break;
            case '-2':
                $subject = "Resignation canceled";
                break;
            case '-3':
                $subject = "Canceled by Employee";
                break;
            default:
                break;
        }

        return $this->from('noreply@deprakoso.site', 'HR Info')
            ->subject('[OFFBOARDING] ' . $subject . ' - ' . $this->offboardingData->employee->name)
            ->view('emails.resignationrequest')
            ->with('offboardingData', $this->offboardingData)
            ->with('subject', $subject)
            ->with('options', $this->options)
            ->with('type', $this->type);

        // switch ($this->type) {
        //     case '1':
        //         break;
        //     case '2':
        //         return $this->from('noreply@indosat.com', 'noreply')
        //         ->view('emails.resignationconfirmation')
        //         ->with('offboardingData',$this->offboardingData);
        //         break;
        //     case '3':
        //         return $this->from('noreply@indosat.com', 'noreply')
        //         ->view('emails.resignationconfirmation')
        //         ->with('offboardingData',$this->offboardingData);
        //         break;
        //     default:
        //         # code...
        //         break;
        // }


        // return $this->view('view.name');
    }
}

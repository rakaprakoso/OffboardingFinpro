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
                $subject = "Resign Approval";
                break;
            case '2':
                $subject = "Resign Verification";
                break;
            case '3':
                $subject = "Effective Date Changed";
                break;
            case '-3':
                $subject = "Offboarding Cancel";
                break;
            default:
                break;
        }

        return $this->from('noreply@indosat.com', 'noreply')
            ->subject($subject)
            ->view('emails.resignationrequest')
            ->with('offboardingData', $this->offboardingData)
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

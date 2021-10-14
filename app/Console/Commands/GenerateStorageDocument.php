<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateStorageDocument extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:GenerateStorageDocument';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Storage Document';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $listStorage = [
            public_path('storage/Documents'),
            public_path('storage/Documents/CV'),
            public_path('storage/Documents/Exit Clearance'),
            public_path('storage/Documents/Offboarding'),
            public_path('storage/Documents/Payroll'),
            public_path('storage/Documents/Resign Letter'),
            public_path('storage/Documents/Return Data'),
        ];
        // $folderPath = public_path('storage/Documents');
        foreach ($listStorage as $key => $value) {
            mkdir($value);
        }
        return 0;
    }
}

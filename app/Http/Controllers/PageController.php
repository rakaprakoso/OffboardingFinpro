<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Artesaos\SEOTools\Facades\SEOTools;
class PageController extends Controller
{
    public function home(){
        return view('home');
    }
    public function index(){
        SEOTools::setTitle('Offboarding Employee');
        SEOTools::setDescription('Offboarding Employee');
        SEOTools::opengraph()->setUrl('https://tiptronic.deprakoso.site/');
        SEOTools::setCanonical('https://tiptronic.deprakoso.site/');
        SEOTools::opengraph()->addProperty('type', 'Homepage');
        // SEOTools::twitter()->setSite('@LuizVinicius73');
        SEOTools::jsonLd()->addImage('https://keinabeauty.com/assets/green-white.png');

        return view('index');
    }
}

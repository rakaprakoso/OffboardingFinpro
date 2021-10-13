<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/admin/{path?}', function () {
//     return view('index_admin');
// })->middleware(['auth'])->name('admin');
require __DIR__.'/auth.php';
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/admin/pdfGenerate', [AdminController::class, 'pdfGenerate'])->name('pdfGenerate');
Route::get('/admin/pdfPreview', [AdminController::class, 'pdfPreview'])->name('pdfPreview');
Route::get('/admin/pdfStore', [AdminController::class, 'pdfStore']);
Route::view('/admin/{path?}', 'index_admin')->where('path', '([A-z\d\-\/_.]+)?')->middleware(['auth']);


Route::middleware('cache.headers:public;max_age=2628000;etag')->group(function () {
    Route::get('/{path?}', [PageController::class, 'index'])->where('path', '([A-z\d\-\/_.]+)?');
});




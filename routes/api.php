<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ecommerce\ProductController;
use App\Http\Controllers\Ecommerce\CartController;
use App\Http\Controllers\AjaxController;
use App\Http\Controllers\APIController;
use App\Http\Controllers\Ecommerce\OrderController;

use App\Http\Controllers\Ecommerce\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Ecommerce\Admin\ImageController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OffboardingController;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });



Route::group([
    'as' => 'admin.',
    'prefix'=>'admin',
    // 'middleware' => 'auth',
], function () {
    Route::resource('product', AdminProductController::class);
    Route::resource('image', ImageController::class);
});


Route::group([
    'as' => 'ajax.',
    'prefix'=>'ajax',
], function () {
    // Route::post('/dateFormat', 'AjaxController@dateFormat')->name('dateFormat');
    // Route::post('/coupon', 'AjaxController@coupon')->name('coupon');
    Route::post('/cart',[AjaxController::class,'addToCart'])->name('addToCart');
    Route::post('/updateCart', [AjaxController::class,'updateCart'])->name('updateCart');
});

Route::get('/cart',[CartController::class,'cart'])->name('listCart');
Route::get('/deleteCart',[AjaxController::class,'deleteCart'])->name('deleteCart');
Route::post('/toCheckout',[AjaxController::class,'cartToCheckout']);

Route::post('/rajaongkir',[AjaxController::class,'rajaongkir']);

Route::post('/createOrder',[OrderController::class,'checkout']);


Route::resource('/product', ProductController::class);

Route::get('/payment/notification',[OrderController::class,'NotificationAPI'])->name('NotificationAPI');
Route::post('/payment/notification',[OrderController::class,'postNotificationAPI'])->name('postNotificationAPI');
Route::get('/orderStatus',[OrderController::class,'status'])->name('status');

Route::resource('/employees', EmployeeController::class);
Route::resource('/offboarding', OffboardingController::class);

Route::post('/resignform',[APIController::class,'postResignForm'])->name('postResignForm');
// Route::post('/newOffboarding',[APIController::class,'postResignForm'])->name('postResignForm');
Route::post('/verifyresignletter',[APIController::class,'postVerifyResignLetter'])->name('postVerifyResignLetter');
Route::post('/employeeReject',[APIController::class,'postEmployeeReject'])->name('postEmployeeReject');
Route::post('/managerconfirmation',[APIController::class,'postManagerConfirmation'])->name('postManagerConfirmation');
Route::post('/requestdocument',[APIController::class,'postRequestDocument'])->name('postRequestDocument');
Route::post('/returndocument',[APIController::class,'postReturnDocument'])->name('postReturnDocument');
Route::post('/bast',[APIController::class,'postBast'])->name('postBast');
Route::post('/rightobligation',[APIController::class,'postRightObligation'])->name('postRightObligation');
Route::post('/progressRecord',[APIController::class,'postProgressRecord'])->name('postProgressRecord');

Route::get('/employeePendingReturnDocument',[APIController::class,'employeePendingReturnDocument'])->name('employeePendingReturnDocument');
Route::get('/offboardingstatus',[APIController::class,'offboardingStatus'])->name('offboardingStatus');
Route::get('/exitDocument',[APIController::class,'exitDocument'])->name('exitDocument');
Route::get('/retireEmployee',[APIController::class,'retireEmployee'])->name('retireEmployee');
Route::get('/reminderDocRequest',[APIController::class,'reminderDocRequest'])->name('reminderDocRequest');
Route::get('/reportScheduler',[APIController::class,'reportScheduler'])->name('reportScheduler');
Route::get('/accResignDocument',[APIController::class,'accResignDocument'])->name('accResignDocument');


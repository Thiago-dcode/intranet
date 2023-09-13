<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\ValidateTokenController;
use App\Http\Controllers\Intranet\Modules\ArticulosController;

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


Route::middleware('auth:sanctum')->group(function () {
  $user = auth('sanctum')->user();
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/company',[AuthController::class,'company']);
    if($user){

     require_once __DIR__.'/modules.php';
      
      moduleRoutes($user->modules);


    }
});

Route::post('/login', [AuthController::class, 'login']);


<?php

use App\Models\User;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Intranet\UserController;
use App\Http\Controllers\Intranet\ModuleController;
use App\Http\Controllers\Intranet\CompanyController;


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
  Route::patch('/user/{id}', [UserController::class, 'update']);
  Route::get('/company', [AuthController::class, 'company']);
  Route::patch('/company/{id}', [CompanyController::class, 'update']);
  Route::post('/active-company', [AuthController::class, 'activeCompany']);
  Route::post('/active-module', [AuthController::class, 'activeModule']);
  Route::get('/modules', [ModuleController::class, 'modules']);
  Route::post('/modules', [ModuleController::class, 'create']);
  Route::patch('/modules/{id}', [ModuleController::class, 'update']);
  if ($user) {
   
    $modules = User::allModules($user->id);
  
    require_once __DIR__ . '/modules.php';

    moduleRoutes($modules->toArray());
  }
});

Route::post('/login', [AuthController::class, 'login']);

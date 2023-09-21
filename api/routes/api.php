<?php

use App\Models\User;
use App\Models\ModuleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
  Route::get('/company', [AuthController::class, 'company']);
  Route::post('/active-company', [AuthController::class, 'activeCompany']);
  Route::post('/active-module', [AuthController::class, 'activeModule']);
  Route::get('/modules', [AuthController::class, 'modules']);
  if ($user) {
   
    $modules = ModuleUser::allUserModules($user->id);
  
    require_once __DIR__ . '/modules.php';

    moduleRoutes($modules->toArray());
  }
});

Route::post('/login', [AuthController::class, 'login']);

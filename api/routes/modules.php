<?php
use App\Intranet\Utils\Utils;
use App\Http\Controllers\Intranet\Modules\ClientesController;
use App\Http\Controllers\Intranet\Modules\EansController;
use App\Http\Controllers\Intranet\Modules\ArticulosController;
use App\Http\Controllers\Intranet\Modules\GraficosController;
use App\Http\Controllers\Intranet\Modules\EmailController;
       
       function moduleRoutes($modules){
        
            foreach ($modules as $key => $module) {
              
                $module= Utils::objectToArray($module);
               
             switch ( $module["name"]) {
            case 'clientes':
           Route::get( '/modules/clientes',[App\Http\Controllers\Intranet\Modules\ClientesController::class,'index']);
                 break;

            case 'eans':
           Route::get( '/modules/eans',[App\Http\Controllers\Intranet\Modules\EansController::class,'index']);
                 break;

            case 'articulos':
           Route::get( '/modules/articulos',[App\Http\Controllers\Intranet\Modules\ArticulosController::class,'index']);
                 break;

            case 'graficos':
           Route::get( '/modules/graficos',[App\Http\Controllers\Intranet\Modules\GraficosController::class,'index']);
                 break;

            case 'email':
           Route::get( '/modules/email',[App\Http\Controllers\Intranet\Modules\EmailController::class,'index']);
                 break;

            default:
             # code...
             break;
     }
    }
   

}
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
           Route::get( '/modules/clientes',[ClientesController::class,'index']);
                 break;

            case 'eans':
           Route::get( '/modules/eans',[EansController::class,'index']);
                 break;

            case 'articulos':
             
           Route::get( '/modules/articulos',[ArticulosController::class,'index']);
                 break;

            case 'graficos':
           Route::get( '/modules/graficos',[GraficosController::class,'index']);
                 break;

            case 'email':
               
           Route::get( '/modules/email',[EmailController::class,'index']);
                 break;

            default:
             # code...
             break;
     }
     require_once __DIR__ . '/modulesCustomRoutes.php';
     customModulesRoutes($module['name']);
    }
    
   

}

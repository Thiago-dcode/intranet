<?php

use App\Http\Controllers\Intranet\Modules\GraficosController;
use App\Http\Controllers\Intranet\Modules\ArticulosController;

function moduleRoutes($modules){

  

    foreach ($modules as $key => $module) {

     switch ($module['name']) {
         case 'articulos':
            Route::get($module['route'],[ArticulosController::class,'index']);
             break;
             case 'graficos':
                Route::get($module['route'],[GraficosController::class,'index']);
                 break;
         
         default:
             # code...
             break;
     }
    }
   

}
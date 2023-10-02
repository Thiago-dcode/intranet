<?php


use App\Http\Controllers\Intranet\Modules\EansController;


//import your routes h


//Write your custom routes here.
//Index route is already created.

function customModulesRoutes($moduleName){
   

      
    switch ($moduleName) {
       
        case 'articulos':
            Route::get('/modules/articulos/example',[ App\Http\Controllers\Intranet\Modules\ArticulosController::class, 'example']); 
    
            break;
        case 'eans':
    
            Route::get('/modules/eans/proveedores',[ App\Http\Controllers\Intranet\Modules\EansController::class,'proveedores']);
            Route::post('/modules/eans/update',[ App\Http\Controllers\Intranet\Modules\EansController::class,'update']);
            break;
            case 'graficos':
                Route::get('/modules/graficos/types',[ App\Http\Controllers\Intranet\Modules\GraficosController::class,'types']);
                Route::post('/modules/graficos/new',[ App\Http\Controllers\Intranet\Modules\GraficosController::class,'create']);
                Route::patch('/modules/graficos/{id}',[ App\Http\Controllers\Intranet\Modules\GraficosController::class,'update']);
                Route::delete('/modules/graficos/{id}',[ App\Http\Controllers\Intranet\Modules\GraficosController::class,'delete']);
                break;
        default:
            # code...
            break;
    }
    
    
    }




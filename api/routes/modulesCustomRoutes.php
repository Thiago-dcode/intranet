<?php
//import your routes h


//Write your custom routes here.
//Index route is already created.

switch ($module["name"]) {
    case 'articulos':
        Route::get('/modules/articulos/example',[ArticulosController::class, 'example']); 

        break;
    case 'eans':

        Route::get('/modules/eans/proveedores',[EansController::class,'proveedores']);

    default:
        # code...
        break;
}
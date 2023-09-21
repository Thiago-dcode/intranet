<?php
//import your routes h


//Write your custom routes here.
//Index route is already created.

switch ($module["name"]) {
    case 'articulos':
        Route::get('/module/articulos/example',[ArticulosController::class, 'example']); 

        break;
    
    default:
        # code...
        break;
}
<?php

namespace App\Http\Controllers\Intranet\Modules;

use App\Intranet\Modules\Eans;
use Illuminate\Http\Request;

use App\Traits\HttpResponses;

use App\Http\Controllers\Controller;


class EansController extends Controller

{


        use HttpResponses;



        public function index(Request $request)
        {

             
                $limit = isset($request['limit']) ? $request['limit'] : 50;
                $cod_articulo = isset($request['codarticulo']) ?$request['codarticulo'] : '';
                $id_proveedor = isset($request['proveedor']) ? $request['proveedor'] : '';
           
                return \response(Eans::getAll($limit, $cod_articulo, $id_proveedor));
        }
}

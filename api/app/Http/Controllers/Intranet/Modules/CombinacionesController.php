<?php
namespace App\Http\Controllers\Intranet\Modules;
use App\Models\Module;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Intranet\Utils\Validate;
use App\Intranet\Utils\TreeBuilder;
use App\Http\Controllers\Controller;
use App\Intranet\Modules\Combinaciones;

class CombinacionesController extends Controller{

	use HttpResponses;

	public function index($companyName, Request $request){

		if(!Validate::module($request->user(),"combinaciones",$companyName)){

			return response("You are not authorized to access to Combinaciones module",401);
		}
		$cod_articulo = isset($request['codarticulo']) ? $request['codarticulo'] : '';
		$proveedor = isset($request['proveedor']) ? $request['proveedor'] : '';
		
		
		$result= Combinaciones::get($companyName,$cod_articulo,$proveedor);


		return $this->success($result,'Success');
	}

	public function categoriaWeb($companyName,Request $request){

		if(!Validate::module($request->user(),"combinaciones",$companyName)){

			return response("You are not authorized to access to Combinaciones module",401);
		}

		if(!isset($request['id'])){

			return $this->error([],'Missing data',400 );
		}

		$result = TreeBuilder::build(Combinaciones::getWebCategoria((int)$request['id'],$companyName), 'CODIGO', 'CODPADRE', 'NOMBRE');

		return $this->success($result,'Success');
	}

	public function update($companyName,Request $request){

		if(!Validate::module($request->user(),"combinaciones",$companyName)){

			return response("You are not authorized to access to Combinaciones module",401);
		}
		$result = false;
		foreach ($request->toArray()['form'] as $key => $articulo) {
			

			 $result = Combinaciones::update($companyName,$articulo);
			
		}
		if($result)
		{ return $this->success($request->toArray()['form'],'');}

		return $this->error([],'',420);

	}
}
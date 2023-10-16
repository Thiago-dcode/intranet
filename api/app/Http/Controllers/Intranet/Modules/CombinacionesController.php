<?php
namespace App\Http\Controllers\Intranet\Modules;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Intranet\Utils\Validate;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;

class CombinacionesController extends Controller{

	use HttpResponses;

	public function index($name, Request $request){

		if(!Validate::module($request->user(),"combinaciones",$name)){

			return response("",401);
		}

		 //start your logic here
		return response("Combinaciones module for campany $name created successfully.");
	}

}
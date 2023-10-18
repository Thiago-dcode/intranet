<?php

namespace App\Http\Controllers\Intranet;

use App\Models\User;
use App\Models\Module;
use App\Models\ModuleUser;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use App\Intranet\Utils\ModuleBuilder;
use Illuminate\Validation\ValidationException;

class UserController extends Controller

{

    use HttpResponses;


    public function update($id, Request $request){

        
        $user = User::find($id);

            if(isset($request['company']) && isset($request['modules']) ){

                    foreach ($request['modules'] as $key => $module) {
                       
                        if(User::findModule($id,$request['company'],$module )) continue;
                        
                        ModuleUser::firstOrCreate([

                            'user_id' => $id,
                            'company' => $request['company'],
                            'module_id' => $module

                        ]);
                    }



            }
            
            return $this->success([
                'user'=> $user,
                'modules'=> User::allModulesByCompany( $user->id,$request['company']),
            ]);
            

    }

}
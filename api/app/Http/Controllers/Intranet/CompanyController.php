<?php

namespace App\Http\Controllers\Intranet;
    
use App\Models\Module;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
       
class CompanyController extends Controller{

            
               use HttpResponses;

               

        public function index( Request $request){

        }

        public function update($id, Request $request){
            $company = Company::find($id);
                    
        // try {
        //     $fields = $request->validate([
        //         'name'  =>  'required|max:255|unique:companies,name,' . $id,
        //         'color' => 'string',
        //         'logo' => 'string',
        //     ]);
        // } catch (ValidationException $e) {
        //     // Validation failed; return an error response with validation messages

        //     return $this->error($e->errors(), '', 422);

        // }

        // $company->update($fields);
         
            if(isset($request['modules'])){
                $modulesToAttach = [];
                foreach ($request['modules'] as $key => $module) {

                    if($company->modules()->where('modules.id', $module)->exists() || !Module::find($module)) continue;
                    array_push($modulesToAttach,$module);
                    
                }
               
                 $company->modules()->attach( $modulesToAttach);

            } 

            return  $this->success(Company::find($id), 'Company updated correctly');
            


        }

 }
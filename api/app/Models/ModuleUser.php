<?php

namespace App\Models;

use App\Intranet\Utils\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModuleUser extends Model
{
    use HasFactory;


    public static function allUserModules($userId){

        $modulesIds = ModuleUser::where('user_id',$userId)->pluck('module_id')->toArray();
        return DB::table('modules')->whereIn('id', $modulesIds)->get();
       
    }
    public static function allUserModulesByCompany($userId,$companyName){

        $modulesIds = ModuleUser::where('user_id',$userId)->where('company', $companyName)->pluck('module_id')->toArray();

        return  DB::table('modules')->whereIn('id', $modulesIds)->get();
    }
    public static function findUserModule($userId,$companyName,$moduleName){

        foreach (static::alluserModulesByCompany($userId,$companyName) as $key => $module) {
           $module = Utils::objectToArray($module);
         
            if($module['name']!== $moduleName) continue;
            return $module;
        }

    }
}

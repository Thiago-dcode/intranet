<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModuleUser extends Model
{
    use HasFactory;


    public static function userModules($userId){

        $modulesIds = ModuleUser::where('user_id',$userId)->pluck('module_id')->toArray();
        return DB::table('modules')->whereIn('id', $modulesIds)->get();
       
    }
    public static function userModulesByCompany($userId,$companyName){

        $modulesIds = ModuleUser::where('user_id',$userId)->where('company', $companyName)->pluck('module_id')->toArray();

        return  DB::table('modules')->whereIn('id', $modulesIds)->get();
    }
}

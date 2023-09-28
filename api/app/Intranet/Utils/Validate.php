<?php
namespace App\Intranet\Utils;

use App\Traits\HttpResponses;
use Symfony\Component\HttpFoundation\Request;

class Validate {

    use HttpResponses;
    public static function companyIsActive(Request $request){

        return $request->user()->company_active? true : false;
            
   

    }


}
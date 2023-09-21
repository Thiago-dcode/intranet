<?php

namespace App\Intranet\Utils;



class Utils {


    public static function objectToArray($obj){


        if(!is_object($obj) && is_array($obj)) return $obj;

        return json_decode(json_encode($obj), true);

    }



}
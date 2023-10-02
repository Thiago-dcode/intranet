<?php
namespace App\Intranet\Utils;

use App\Intranet\Utils\Path;
use App\Intranet\Pyme\PymeConnection;

class Validate {

     

    public static function Sql($companyName,$sql){

        try {
            $connection = PymeConnection::start(Constants::get($companyName));
            $stm = $connection->prepare($sql);
            $stm->execute([]);
           return [
            'result' => $stm->execute([]),
            'message'=> 'Valid SQL'

           ];
        } catch (\Throwable $th) {
            
            return [
                'result' => false,
                'message'=> $th->getMessage()
            ];
           
        }
   

    }
}
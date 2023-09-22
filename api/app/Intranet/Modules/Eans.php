<?php

namespace App\Intranet\Modules;
use PDO;
use App\Models\Module;
use App\Intranet\Utils\Path;
use App\Intranet\Utils\Utils;
use App\Intranet\Pyme\PymeConnection;

class Eans
{


    public static function getAll($limit = 50, $codArticulo = '', $proveedor = '')
    {

        $filter = '';
      

        if ($codArticulo) {

            $filter .= "AND cb.codarticulo = " . "'" . $codArticulo . "'";
        }
        if ($proveedor) {

            $filter .= "AND a.PROVEEDDEFECTO = " . (int)$proveedor;
        }


        $sql = "SELECT FIRST 50 cb.codarticulo, a.nombre, p.nombrecomercial as Proveedor, cb.valorcaract, cb.codbarras, ce.stock1
FROM codbarra cb
LEFT JOIN carexist ce ON cb.codarticulo = ce.codarticulo AND cb.valorcaract = ce.valor
JOIN articulo a ON cb.codarticulo = a.codigo
JOIN proveed p ON a.PROVEEDDEFECTO = p.codigo

WHERE cb.codbarras LIKE '20000%'
        $filter
  AND ce.stock1 > 0
  and ce.codalmacen = 2
ORDER BY cb.codarticulo, cb.valorcaract;
              ";
			  
	;
       
        $stmt = PymeConnection::start(env('DBHOST_BERA_TEXTIL_PYME'))->prepare($sql);
        $stmt->execute([]);



        return  $stmt->fetchAll(PDO::FETCH_ASSOC);


       
    }
    
}
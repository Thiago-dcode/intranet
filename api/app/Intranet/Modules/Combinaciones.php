<?php

namespace App\Intranet\Modules;
use PDO;
use App\Intranet\Utils\Utils;
use App\Intranet\Utils\Constants;
use App\Intranet\Pyme\PymeConnection;

class Combinaciones
{
    


    

    public static function get($company,$codArticulo,$proveedor){

        $firebird = PymeConnection::start(Constants::get($company));

        $result =[];

        if($proveedor){
      
        $sql = "SELECT first 10  codarticulo as codigo FROM compra WHERE codproveedor = :codproveedor";
        $stmt = $firebird->prepare($sql);
        $stmt->execute([':codproveedor' => $proveedor]);
        $result = $stmt->fetchAll();

        }elseif ($codArticulo) {
            $sql = "SELECT first 10  codigo FROM articulo WHERE codigo LIKE :codarticulo";
            $stmt = $firebird->prepare($sql);
            // to uppercase
            $stmt->execute([':codarticulo' => '%' . strtoupper($codArticulo) . '%']);
            $result = $stmt->fetchAll();
        }
        $data = [];

        $articulos = array_map(function ($item) {
            return $item['CODIGO'];
        }, $result);

        $in = "";
        $i = 0;
        foreach ($articulos as $item) {
            $key = ":id" . $i++;
            $in .= ($in ? "," : "") . $key; // :id0,:id1,:id2
            $in_params[$key] = $item; // collecting values into a key-value array
        }
       
       

        $sql = "select articulo.codigo, articulo.nombre, articulo.preciocoste, articulo.precioventa, articulo.codmarca, articulo.codfamilia, articulo.proveeddefecto, articulo.metakeywords,
        carvalortemporada.valor as temporada, carvalorcoleccion.valor as coleccion, webgrupocategoriaarticulo.codgrupocategoria, webgrupocategoriaarticulo.codcategoriadefecto
        from articulo
        left join caract as caracttemporada on caracttemporada.codclase=2 and caracttemporada.nombre='Temporada'
        left join carvalor as carvalortemporada on carvalortemporada.codcaract = caracttemporada.codcaract and carvalortemporada.codobjeto= articulo.codigo
        left join caract as caractcoleccion on caractcoleccion.codclase=2 and caractcoleccion.nombre='Colección'
        left join carvalor as carvalorcoleccion on carvalorcoleccion.codcaract = caractcoleccion.codcaract and carvalorcoleccion.codobjeto= articulo.codigo
        left join webgrupocategoriaarticulo on webgrupocategoriaarticulo.codarticulo= articulo.codigo
        where articulo.codigo IN ($in)";

        $stmt = $firebird->prepare($sql);
        $stmt->execute($in_params);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data = $result;


        foreach ($data as $key => $articulo) {
            $sql = 'select carvalid.dimension, carvalid.orden, carvalid.valor, caract.nombre
            from carvalid
            left join caract on caract.codcaract = carvalid.codcaract and caract.dimension = carvalid.dimension
            where carvalid.codobjeto = :codigo
            order by carvalid.dimension, carvalid.orden';
            $stmt = $firebird->prepare($sql);
            $stmt->execute(['codigo' => $articulo['CODIGO']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $color = [];
            $copa = [];
            $talla = [];
            foreach ($result as $value) {
                if (substr($value['NOMBRE'], 0, 5) == 'COLOR' || substr($value['NOMBRE'], 0, 5) == 'Color') {
                    $color[] = $value['VALOR'];
                } elseif (substr($value['NOMBRE'], 0, 4) == 'COPA' || substr($value['NOMBRE'], 0, 4) == 'Copa') {
                    $copa[] = $value['VALOR'];
                } elseif (substr($value['NOMBRE'], 0, 5) == 'TALLA' || substr($value['NOMBRE'], 0, 5) == 'Talla') {
                    $talla[] = $value['VALOR'];
                }
            }
            $data[$key]['COLOR'] = implode(',', $color);
            $data[$key]['COPA'] = implode(',', $copa);
            $data[$key]['TALLA'] = implode(',', $talla);



            $sql = 'select venta.valorcaract, venta.precio from venta where codarticulo = :codigo';
            $stmt = $firebird->prepare($sql);
            $stmt->execute(['codigo' => $articulo['CODIGO']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $data[$key]['VENTA'] = $result;

            $sql = 'select compra.valorcaract, compra.preciocoste, compra.codproveedor, compra.descuento from compra where codarticulo = :codigo';
            $stmt = $firebird->prepare($sql);
            $stmt->execute(['codigo' => $articulo['CODIGO']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $data[$key]['COMPRA'] = $result;

            $sql = 'select valorcaract from carvaliddeshabilitado where codobjeto = :codigo';
            $stmt = $firebird->prepare($sql);
            $stmt->execute(['codigo' => $articulo['CODIGO']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data[$key]['DESHABILITADO'] = $result;

            $sql = 'select codbarra.valorcaract, codbarra.codbarras from codbarra where codarticulo = :codigo';
            $stmt = $firebird->prepare($sql);
            $stmt->execute(['codigo' => $articulo['CODIGO']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data[$key]['CODBARRAS'] = $result;
        }


        return self::parseData($company,$data);



    }
    public static function getMarca($company){

         $firebird = PymeConnection::start(Constants::get($company));
         $sql = 'SELECT NOMBRE, CODIGO FROM MARCA';
         $stmt = $firebird->prepare($sql);
         $stmt->execute();
         return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
    public static function getProveedor($company){

        $firebird = PymeConnection::start(Constants::get($company));
        $sql = 'SELECT NOMBRECOMERCIAL CODIGO  FROM PROVEED';
        $stmt = $firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

   }
   public static function getTemporada($company){
   
   
    $firebird = PymeConnection::start(Constants::get($company));
    $sql = 'select VALOR from carvalid where codclase = 2 and codcaract = 1 and codobjeto is null';
    $stmt = $firebird->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);

}
    public static function getColeccion($company){
    
        $firebird = PymeConnection::start(Constants::get($company));
        $sql = ' select VALOR from carvalid where codclase = 2 and codcaract = 2 and codobjeto is null';
        $stmt = $firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
    public static function getCategoriaPadre($company){
    
        $firebird = PymeConnection::start(Constants::get($company));
        $sql = ' select * from carvalid where codclase = 2 and codcaract = 2 and codobjeto is null';
        $stmt = $firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }


    private  static function parseData($company,$data){

        $marca = self::getMarca($company);
        
        $proveedor = self::getProveedor($company);
        
        $temporada = self::getTemporada($company);
      
        $coleccion = self::getColeccion($company);
     
        $dataOfdataFormated = [];

        foreach ($data as  $d) {

            $dataFormated = [];

            foreach ($d as $key => $value) {
               
                switch ($key) {
                  
                    case 'CODMARCA':
                          $dataFormated['marca'] =  $marca;
                        break;

                    case 'PROVEEDDEFECTO':
                        $dataFormated['proveedor'] = $proveedor;
                        break;
                    case 'PRECIOCOSTE':
                        $dataFormated['precio'] = Utils::roundTo($value,2);
                        $dataFormated['descuento'] = 0;
                        $dataFormated['p.coste'] = Utils::roundTo($value,2);
                        $dataFormated['margen'] = Utils::percentage($value,$d['PRECIOVENTA']);
                        break;
                    case 'PRECIOVENTA':
                        $dataFormated['P.V.A'] = Utils::roundTo($value,2);
                        break;
                    case 'TEMPORADA':
                        $dataFormated['temporada'] = $temporada;
                        break;
                    case 'COLECCION':
                        $dataFormated['coleccion'] = $coleccion;
                        break;
                    // case 'CODGRUPOCATEGORIA':
                    //         $dataFormated['hombre/mujer'] = self::getCategoriaPadre($company);
                    default:
                        $dataFormated[$key] = $value;
                        break;
                }    
             
            }

            array_push($dataOfdataFormated, $dataFormated);

        }

                dd( $dataOfdataFormated);
      
       


    }



}
<?php

namespace App\Intranet\Modules;

use PDO;
use App\Intranet\Utils\Utils;
use App\Intranet\Utils\Constants;
use App\Intranet\Pyme\PymeConnection;

class Combinaciones
{

    static $firebird = null;



    public static function get($company, $codArticulo, $proveedor)
    {

        static::$firebird = PymeConnection::start(Constants::get($company));
        $firebird = static::$firebird;

        $result = [];

        if ($proveedor) {

            $sql = "SELECT first 10 skip 1 codarticulo as codigo FROM compra WHERE codproveedor = :codproveedor";
            $stmt = $firebird->prepare($sql);
            $stmt->execute([':codproveedor' => $proveedor]);
            $result = $stmt->fetchAll();
        } elseif ($codArticulo) {
            dd($codArticulo);
            $sql = "SELECT first 10 skip 1 codigo FROM articulo WHERE codigo LIKE :codarticulo";
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

        
        return self::parseData($data);
    }


    private static function getMarca()
    {
        $sql = 'SELECT NOMBRE, CODIGO FROM MARCA';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getProveedor()
    {
        $sql = 'SELECT NOMBRECOMERCIAL CODIGO  FROM PROVEED';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getTemporada()
    {
        $sql = 'select VALOR from carvalid where codclase = 2 and codcaract = 1 and codobjeto is null';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getColeccion()
    {
        $sql = ' select VALOR from carvalid where codclase = 2 and codcaract = 2 and codobjeto is null';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getWebGrupoCategoria()
    {
        $sql = 'SELECT * FROM WEBGRUPOCATEGORIA;';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private static function getFamilia()
    {
        $sql = 'SELECT CODIGO, DESCRIPCION,PADRE, ORDEN FROM TIPO WHERE TIPO = 13 ORDER BY ORDEN;';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public static function getWebCategoria($cod)
    {
        $sql = 'SELECT CODGRUPOCATEGORIA, CODIGO, CODPADRE, NOMBRE FROM WEBCATEGORIA WHERE CODGRUPOCATEGORIA = :cod;';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute(['cod' => $cod]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private  static function parseData($data)
    {

        $marca = self::getMarca();

        $proveedor = self::getProveedor();

        $temporada = self::getTemporada();

        $coleccion = self::getColeccion();

        $webGrupoCategoria = self::getWebGrupoCategoria();

        $familia = self::getFamilia();
       
       

        $dataOfdataFormated = [];

        foreach ($data as  $d) {

            $dataFormated = [];

            foreach ($d as $key => $value) {

                switch ($key) {
                        //some values start with a underscore to easy identify them on frontend to avoid to printing them
                        //They store important data that is necessary to identify some data.

                    case 'CODMARCA':
                        $dataFormated['_marca'] = $value;
                        $dataFormated['marca'] =  $marca;
                        break;
                    case 'PROVEEDDEFECTO':
                        $dataFormated['_proveedor'] = $value;
                        $dataFormated['proveedor'] = $proveedor;
                        break;
                    case 'PRECIOCOSTE':
                        $dataFormated['precio'] = Utils::roundTo($value, 2);
                        $dataFormated['descuento'] = 0;
                        $dataFormated['p.coste'] = Utils::roundTo($value, 2);
                        $dataFormated['margen'] = Utils::percentage($value, $d['PRECIOVENTA']);
                        break;
                    case 'PRECIOVENTA':
                        $dataFormated['P.V.A'] = Utils::roundTo($value, 2);
                        break;
                    case 'TEMPORADA':
                        $dataFormated['_temporada'] = $value;
                        $dataFormated['temporada'] = $temporada;
                        break;
                    case 'COLECCION':
                        $dataFormated['_coleccion'] = $value;
                        $dataFormated['coleccion'] = $coleccion;
                        break;
                    case 'CODGRUPOCATEGORIA':
                        $dataFormated["_grupocategoria"] = $value;
                        $dataFormated["hombre/mujer"] = $webGrupoCategoria;
                        $dataFormated['cat. web'] = self::getWebCategoria($value);
                        break;
                    case "CODFAMILIA":
                       
                        $dataFormated['_familia'] = $value;
                        $dataFormated['familia'] = $familia;
                        break;

                    default:
                        $dataFormated[$key] = $value;
                        break;
                }
            }

            array_push($dataOfdataFormated, $dataFormated);
        }

        return $dataOfdataFormated;
    }
}

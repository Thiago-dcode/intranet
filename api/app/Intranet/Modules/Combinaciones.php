<?php

namespace App\Intranet\Modules;

use PDO;
use App\Intranet\Utils\Utils;
use App\Intranet\Utils\Constants;
use App\Intranet\Utils\TreeBuilder;
use App\Intranet\Pyme\PymeConnection;

class Combinaciones
{

    static $firebird = null;



    public static function get($company, $codArticulo, $proveedor)
    {

        static::$firebird = PymeConnection::start(Constants::get($company));
        $firebird = static::$firebird;

        $result = [];


        $offset = 0;
        $page = 1;


        if ($proveedor) {
            // $sql = "select count(*) as total from compra WHERE codproveedor = :codproveedor";
            // $stmt = $firebird->prepare($sql);
            // // to uppercase
            // $stmt->execute([':codproveedor' => $proveedor]);
            // $count = (int)$stmt->fetch(PDO::FETCH_ASSOC)['TOTAL'];
            // if ($count == 0) {
            //     return new JsonResponse(
            //         [
            //             'status' => 'success',
            //             'data' => [],
            //             'count' => $count,
            //             'page' => $page,
            //         ],
            //         200,
            //         ["Content-Type" => "application/json"]
            //     );
            // }

            $sql = "SELECT first 10 skip $offset codarticulo as codigo FROM compra WHERE codproveedor = $proveedor";
            $stmt = $firebird->prepare($sql);

            $stmt->execute();

            $result = $stmt->fetchAll();
        } elseif ($codArticulo) {


            $codArticulo = strtoupper($codArticulo);

            $sql = "SELECT first 10 skip $offset codigo FROM articulo WHERE codigo LIKE '%$codArticulo%'";
            $stmt = $firebird->prepare($sql);
            // to uppercase
            $stmt->execute();
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
        $sql = 'SELECT NOMBRE as nombre, CODIGO as codigo FROM MARCA';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getProveedor()
    {
        $sql = 'SELECT NOMBRECOMERCIAL as nombre, CODIGO as codigo  FROM PROVEED';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getTemporada()
    {
        $sql = 'select VALOR as nombre from carvalid where codclase = 2 and codcaract = 1 and codobjeto is null';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    private static function getColeccion()
    {
        $sql = ' select VALOR as nombre from carvalid where codclase = 2 and codcaract = 2 and codobjeto is null';
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
        $sql = 'SELECT CODIGO as codigo, DESCRIPCION as nombre,PADRE, ORDEN FROM TIPO WHERE TIPO = 13 ORDER BY ORDEN;';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public static function getWebCategoria($cod, $company = '')
    {
        if (!static::$firebird) {

            static::$firebird = PymeConnection::start(Constants::get($company));
        }

        try {
            $sql = 'SELECT CODGRUPOCATEGORIA, CODIGO as codigo, CODPADRE, NOMBRE as nombre, ORDEN FROM WEBCATEGORIA WHERE CODGRUPOCATEGORIA = ' . $cod . 'ORDER BY ORDEN;';
            $stmt = static::$firebird->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle the exception, e.g., log the error or display an error message
            echo 'Error: ' . $e->getMessage();
        }
    }



    private  static function parseData($data)
    {

        $marca = self::getMarca();

        $proveedor = self::getProveedor();

        $temporada = self::getTemporada();

        $coleccion = self::getColeccion();

        $webGrupoCategoria = self::getWebGrupoCategoria();

        $familia = TreeBuilder::build(self::getFamilia(), 'CODIGO', 'PADRE', 'NOMBRE', -1);


        // all keys from the api start with  S,A,T,OR C 
        // S: The value of that key is a simple string or number.
        // A: The value is an Array.
        // T: The value is a Tree.
        // C: The value depends on combinations.


        $dataOfdataFormated = [];

        foreach ($data as  $d) {

            $dataFormated = [];

            foreach ($d as $key => $value) {

                switch ($key) {


                    case 'CODIGO':
                        $dataFormated['S_COD'] = $value;

                        break;

                    case 'METAKEYWORDS':
                        $dataFormated['S_metakey'] = $value;

                        break;
                    case 'COPA':


                        break;


                    case 'CODMARCA':

                        $dataFormated['A_marca'] = [
                            'id' => $value,
                            'data' =>  $marca,
                        ];;
                        break;
                    case 'PROVEEDDEFECTO':

                        $dataFormated['A_proveedor'] = [
                            'id' => $value,
                            'data' =>  $proveedor,
                        ];
                        break;
                    case 'PRECIOCOSTE':
                        $dataFormated['S_precio'] = Utils::roundTo($value, 2);
                        $dataFormated['S_desc'] = 0;
                        $dataFormated['S_p.coste'] = Utils::roundTo($value, 2);
                        $dataFormated['S_margen'] = Utils::percentage($value, $d['PRECIOVENTA']);

                        break;
                    case 'PRECIOVENTA':
                        $dataFormated['S_P.V.A'] = Utils::roundTo($value, 2);
                        break;
                    case 'TEMPORADA':

                        $dataFormated['A_temporada'] = [
                            'id' => $value,
                            'data' =>  $temporada,
                        ];

                        break;
                    case 'COLECCION':

                        $dataFormated['A_coleccion'] = [
                            'id' => $value,
                            'data' =>  $coleccion,
                        ];;

                        break;
                    case 'CODGRUPOCATEGORIA':

                        $dataFormated["A_hombre/mujer"] = [
                            'id' => $value,
                            'data' =>  $webGrupoCategoria
                        ];

                        $dataFormated['T_cat.web'] = [
                            'id' => $d["CODCATEGORIADEFECTO"],

                            'data' => TreeBuilder::build(self::getWebCategoria(((int)$value)), 'CODIGO', 'CODPADRE', 'NOMBRE'),
                        ];

                        break;
                    case "CODFAMILIA":


                        $dataFormated['T_familia'] = [
                            'id' => $value,
                            'data' =>  $familia,
                        ];;
                        break;

                    case 'VENTA':
                        $dataFormated['C_venta'] = $value;

                        break;
                    case 'COMPRA':
                        $dataFormated['C_compra'] = $value;

                        break;

                    case 'CODBARRAS':
                        $dataFormated['C_codbar'] = $value;

                        break;
                    case 'DESHABILITADO':
                        $dataFormated['S_deshab'] = $value;

                        break;
                    case 'CODCATEGORIADEFECTO':


                        break;


                    default:
                        $dataFormated['S_' . strtolower($key)] = $value;
                        break;
                }
            }

            array_push($dataOfdataFormated, $dataFormated);
        }

        return $dataOfdataFormated;
    }
}

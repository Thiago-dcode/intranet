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



    public static function get($company, $codArticulo, $proveedor, $limit = 10)
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

            $sql = "SELECT  codarticulo as codigo FROM compra WHERE codproveedor = $proveedor";
            $stmt = $firebird->prepare($sql);

            $stmt->execute();

            $result = $stmt->fetchAll();
        } elseif ($codArticulo) {


            $codArticulo = strtoupper($codArticulo);

            $sql = "SELECT  codigo FROM articulo WHERE codigo LIKE '%$codArticulo%'";
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


        $to = $limit - 9;
        $sql = "select articulo.codigo, articulo.nombre, articulo.preciocoste, articulo.precioventa, articulo.codmarca, articulo.codfamilia, articulo.proveeddefecto, articulo.metakeywords,
        carvalortemporada.valor as temporada, carvalorcoleccion.valor as coleccion, webgrupocategoriaarticulo.codgrupocategoria, webgrupocategoriaarticulo.codcategoriadefecto
        from articulo
        left join caract as caracttemporada on caracttemporada.codclase=2 and caracttemporada.nombre='Temporada'
        left join carvalor as carvalortemporada on carvalortemporada.codcaract = caracttemporada.codcaract and carvalortemporada.codobjeto= articulo.codigo
        left join caract as caractcoleccion on caractcoleccion.codclase=2 and caractcoleccion.nombre='Colección'
        left join carvalor as carvalorcoleccion on carvalorcoleccion.codcaract = caractcoleccion.codcaract and carvalorcoleccion.codobjeto= articulo.codigo
        left join webgrupocategoriaarticulo on webgrupocategoriaarticulo.codarticulo= articulo.codigo
        where articulo.codigo IN ($in)
        ROWS $to to $limit";

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
    private static function getPrecio($codart, $proveed)
    {


        try {
            $sql = "select preciotarifa from compra where codarticulo = '$codart' and codproveedor = $proveed";

            $stmt = static::$firebird->prepare($sql);

            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC)['PRECIOTARIFA'];
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


        function getComb($color, $talla)
        {


            $comb = [];
            foreach (explode(',', $color) as $key => $col) {

                foreach (explode(',', $talla) as $key => $tal) {

                    array_push($comb, "$col-$tal");
                }
            }

            return $comb;
        }

        function getCompraVenta($arr, $codBarra, $priceKeyName = 'PRECIOCOSTE', $articulo = [])
        {

            try {

                return array_map(function ($cod) use ($arr, $priceKeyName) {


                    foreach ($arr as $key => $value) {

                        if ($value["VALORCARACT"] !== $cod["VALORCARACT"]) continue;
                        return [

                            "VALORCARACT" => $value["VALORCARACT"],
                            'hasPrice' => true,
                            'PRECIO' => Utils::roundTo((float)$value[$priceKeyName], 2)

                        ];
                    }
                    return [
                        "VALORCARACT" => $cod["VALORCARACT"],
                        'hasPrice' => false,
                        'PRECIO' => null
                    ];
                }, $codBarra);
            } catch (\Throwable $th) {
            }
        }


        // all keys from the api start with  S,A,T,OR C 
        // S: The value of that key is a simple string or number.
        // A: The value is an Array.
        // T: The value is a Tree.
        // C: The value depends on combinations.


        $dataOfdataFormated = [];

        foreach ($data as  $d) {

            if (isset($d['COPA']) && $d['COPA'])  continue;

            $comb = getComb($d['COLOR'], $d['TALLA']);
            $codBarra = array_map(function ($cod) use ($comb) {

                foreach ($comb as $key => $value) {

                    if ($cod["VALORCARACT"] !== $value) continue;

                    return $cod;
                }
            }, $d['CODBARRAS']);


            $descuento = '';
            foreach ($d['COMPRA'] as $key => $val) {

                if ($val['CODPROVEEDOR'] !== $d['PROVEEDDEFECTO']) continue;
                $descuento =  $val['DESCUENTO'];
                break;
            }

            $precio = self::getPrecio($d['CODIGO'], $d['PROVEEDDEFECTO']);

            $pCompra = getCompraVenta($d['COMPRA'], $codBarra, 'PRECIOCOSTE', $d);


            $pVenta = getCompraVenta($d['VENTA'], $codBarra, 'PRECIO');

            $dataFormated = [];


            foreach ($d as $key => $value) {


                switch ($key) {


                    case 'CODIGO':

                        $dataFormated['S_COD'] = [
                            'id' => '',
                            'data' =>  $value,
                            'readonly' => true
                        ];
                        $dataFormated['S_REF'] = [
                            'id' => '',
                            'data' =>  $value,
                            'readonly' => true
                        ];

                        break;

                    case 'METAKEYWORDS':
                        $dataFormated['S_metakey'] = [
                            'id' => '',
                            'data' =>  $value,
                            'readonly' => false
                        ];

                        break;
                    case 'NOMBRE':

                        $dataFormated['S_nom'] = [
                            'id' => '',
                            'data' =>  $value,
                            'readonly' => true
                        ];
                        $dataFormated['A_marca'] = [
                            'id' => $d['CODMARCA'],
                            'data' =>  $marca,
                            'readonly' => false
                        ];
                        $dataFormated['A_proveed'] = [
                            'id' => $d['PROVEEDDEFECTO'],
                            'data' =>  $proveedor,
                            'readonly' => true
                        ];
                        $dataFormated['S_color'] = [
                            'id' => '',
                            'data' =>  $d['COLOR'],
                            'readonly' => true
                        ];
                        $dataFormated['S_talla'] = [
                            'id' => '',
                            'data' =>  $d['TALLA'],
                            'readonly' => true
                        ];

                        break;
                    case 'COPA':


                        break;
                    case 'COLOR':


                        break;
                    case 'TALLA':


                        break;


                    case 'CODMARCA':


                        break;
                    case 'PROVEEDDEFECTO':


                        break;
                    case 'PRECIOCOSTE':


                        $dataFormated['S_precio'] = [
                            'id' => '',
                            'data' =>   Utils::roundTo($precio, 10),
                            'readonly' => false,
                        ];

                        $dataFormated['S_des'] = [
                            'id' => '',
                            'data' =>  $descuento,
                            'readonly' => false,
                        ];

                        $dataFormated['S_coste'] = [
                            'id' => '',
                            'data' => Utils::roundTo($value, 4),
                            'readonly' => true,
                        ];
                        $dataFormated['S_marg'] = [
                            'id' => '',
                            'data' =>  Utils::percentageBtwNumbers($value, $d['PRECIOVENTA']),
                            'readonly' => false,
                        ];
                        $dataFormated['S_P.V.A'] = [
                            'id' => '',
                            'data' =>  Utils::roundTo($d['PRECIOVENTA'], 4),
                            'readonly' => true,
                        ];

                        break;
                    case 'PRECIOVENTA':

                        break;
                    case 'TEMPORADA':

                        $dataFormated['A_temporada'] = [
                            'id' => $value,
                            'data' =>  $temporada,
                            'readonly' => false,

                        ];

                        break;
                    case 'COLECCION':

                        $dataFormated['A_coleccion'] = [
                            'id' => $value,
                            'data' =>  $coleccion,
                            'readonly' => false,
                        ];;

                        break;
                    case 'CODGRUPOCATEGORIA':

                        $dataFormated["A_hombre/mujer"] = [
                            'id' => $value,
                            'data' =>  $webGrupoCategoria,
                            'readonly' => false,
                        ];

                        $dataFormated['T_cat.web'] = [
                            'id' => $d["CODCATEGORIADEFECTO"],

                            'data' => TreeBuilder::build(self::getWebCategoria(((int)$value)), 'CODIGO', 'CODPADRE', 'NOMBRE'),
                            'readonly' => false,
                        ];
                        $dataFormated['T_familia'] = [
                            'id' => $d['CODFAMILIA'],
                            'data' =>  $familia,
                            'readonly' => false,
                        ];

                        break;
                    case "CODFAMILIA":


                        break;

                    case 'VENTA':


                        break;
                    case 'COMPRA':


                        break;

                    case 'CODBARRAS':
                        $dataFormated['C_venta'] = [
                            'id' => '',
                            'data' =>  $pVenta,
                            'readonly' => false
                        ];
                        $dataFormated['C_compra'] = [
                            'id' => '',
                            'data' =>  $pCompra,
                            'readonly' => false
                        ];
                        $dataFormated['D_deshab'] = [
                            'id' => '',
                            'data' =>  $comb,
                            'deshab' => $d['DESHABILITADO'],
                            'readonly' => false
                        ];
                        $dataFormated['C_codbar'] = [
                            'id' => '',
                            'data' =>  $codBarra,
                            'readonly' => false
                        ];

                        break;
                    case 'DESHABILITADO':



                        break;
                    case 'CODCATEGORIADEFECTO':


                        break;


                    default:

                        $dataFormated['S_' . strtolower($key)] = [
                            'id' => $value,
                            'data' =>  $value,
                            'readonly' => false
                        ];
                        break;
                }
            }

            array_push($dataOfdataFormated, $dataFormated);
        }

        return [
            'count' => count($data),
            'data' => $dataOfdataFormated,

        ];
    }

    private static function getHombreMujer($articulo)
    {
        $hombreMujer = $articulo["hombre/mujer"];

        $sql = "select codigo, nombre from webgrupocategoria where codigo = $hombreMujer";
        $stmt =  static::$firebird->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]['NOMBRE'];
    }
    private static function getCategoriaWeb($articulo)
    {
        $codgrupo = $articulo["hombre/mujer"];
        $codigo = $articulo["cat.web"];

        if (!$codgrupo || !$codigo) return '';
        $sql = "select codgrupocategoria, codigo, codpadre, nombre, orden from webcategoria
        where codgrupocategoria = $codgrupo
        and codigo = $codigo";
        $stmt =  static::$firebird->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $categoriaWeb = $result[0]['NOMBRE'];

        while ($result[0]['CODPADRE'] != 0) {
            $sql = 'select codgrupocategoria, codigo, codpadre, nombre, orden from webcategoria
            where codgrupocategoria = ' . $articulo["hombre/mujer"] . '
            and codigo = ' . $result[0]['CODPADRE'];
            $stmt =  static::$firebird->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $categoriaWeb = $result[0]['NOMBRE'] . '/' . $categoriaWeb;
        }
        return $categoriaWeb;
    }
    private static function getCodCaract($articulo)
    {

        $sql = "select * from carvalid
        left join caract on caract.codcaract = carvalid.codcaract and caract.dimension = carvalid.dimension
        where codobjeto = '" . $articulo['COD'] . "'
        and caract.nombre like 'COLOR%'";

        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $codcaract = '';
        if (sizeof($result) > 0) {
            $codcaract =  $result[0]['CODCARACT'];
        }
        return $codcaract;
    }



    private static function updateArticulos($articulo)
    {

        $hombreMujer = self::getHombreMujer($articulo);

        $categoriaWeb = self::getCategoriaWeb($articulo);

        $vars = [
            'codmarca' => (int) $articulo['marca'],
            'descripcion' => (string) utf8_decode($articulo['nom'] .
                '<br><br>' .
                $articulo['metakey'] ? $articulo['metakey'] : '' .
                ',' .
                $hombreMujer .
                ',' .
                $categoriaWeb),
            'preciocoste' => (float) $articulo['coste'],
            'precioventa' => (float) $articulo['P.V.A'],
            'codfamilia' => (float) $articulo['familia'],
            'metakeywords' => $articulo['metakey'],
            'codigo' => $articulo['COD']
        ];


        $sql = "update articulo set
        codmarca = " . $vars["codmarca"] . ",
        descripcion = '" . $vars["descripcion"] . "',
        preciocoste ='" . $vars["preciocoste"] . "',
        precioventa =" . $vars["precioventa"] . ",
        codfamilia =" . $vars["codfamilia"] . ",
        metakeywords ='" . $vars["metakeywords"] . "'
        where codigo ='" . $vars["codigo"] . "'";

        $stmt = static::$firebird->prepare($sql);



        return $stmt->execute();
    }
    private static function updateCompra($articulo)
    {
        $vars = [
            'codarticulo' => (string) $articulo['COD'],
            'codproveedor' => (int) $articulo['proveed'],
            'preciocoste' => (float) $articulo['coste'],
            'preciotarifa' => (float) $articulo['precio'],
            'descuento' => (float) $articulo['des'],
        ];


        $sql = 'update compra 
        set preciocoste = ' . (float) $vars['preciocoste'] . ', 
            preciotarifa = ' . (float) $vars['preciotarifa'] . ', 
            descuento = ' . (float) $vars['descuento'] . ' 
        WHERE codarticulo = \'' . $vars['codarticulo'] . '\' 
        AND codproveedor = ' . (int) $vars['codproveedor'];
        $stmt = static::$firebird->prepare($sql);


        return $stmt->execute();
        // $combinacionesLogger->debug('Compra actualizada', $vars);
    }

    private static function updateCategoriaWeb($articulo)
    {
        return $articulo;
        $vars = [
            'codarticulo' => $articulo['COD'],
            'codgrupocategoria' => (int) $articulo["hombre/mujer"],
            'codcategoria' => (int) $articulo["cat.web"]
        ];

        $sql = 'UPDATE webcategoriaarticulo 
                SET codgrupocategoria = ' . (int)$vars['codgrupocategoria'] . ', 
                    codcategoria = ' . (int)$vars['codcategoria'] . ' 
                WHERE codarticulo = \'' . $vars['codarticulo'] . '\'';

        $stmt = static::$firebird->prepare($sql);

        return $stmt->execute();
        // $combinacionesLogger->debug('Categoriasweb actualizada', $vars);
    }

    private static function getCodCaractCarValor($nombre)
    {
        $codcaract = '';
        $sql = "select codcaract from caract where codclase=2 and nombre='$nombre'";
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($result) > 0) {
            $codcaract = $result[0]['CODCARACT'];
        }
        return  $codcaract;
    }

    private static function updateCarValor($articulo)
    {
        $codcaractTemporada = self::getCodCaractCarValor('Temporada');
        $codcaractColeccion = self::getCodCaractCarValor('Colección');



        $result = false;

        //temporada

        $vars = [
            'codclase' => 2,
            'codobjeto' => $articulo['COD'],
            'codcaract' => $codcaractTemporada,
            'valor' => $articulo['temporada'],
        ];
        $vars2 = [
            'codclase' => 2,
            'codobjeto' => $articulo['COD'],
            'codcaract' => $codcaractColeccion,
            'valor' => $articulo['coleccion'],
        ];

        $sql = 'UPDATE carvalor 
                SET valor = \'' . $vars['valor'] . '\'
                WHERE codobjeto = \'' . $vars['codobjeto'] . '\' 
                AND codclase = ' . $vars['codclase'] . '
                AND codcaract = ' . $vars['codcaract'];

        $stmt =  static::$firebird->prepare($sql);


        $result = $stmt->execute();


        //coleccion
        $stmt2 = static::$firebird->prepare($sql);


        $result =  $stmt2->execute();
        // $combinacionesLogger->debug('Carvalor Temporada actualizada', $vars);

        return $result;
    }

    private static function updatePrecioVenta($articulo, $codcaract)
    {




        foreach ($articulo['venta'] as $key => $precioVenta) {
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $precioVenta['VALORCARACT'],
                'precio' => (float) $precioVenta['value'],
            ];

            $sql = 'UPDATE venta 
                    SET precio = ' . (float) $vars['precio'] . '
                    WHERE codarticulo = \'' . $vars['codarticulo'] . '\' 
                    AND codcaract = \'' . $vars['codcaract'] . '\' 
                    AND valorcaract = \'' . $vars['valorcaract'] . '\'';
            $stmt = static::$firebird->prepare($sql);

            return $stmt->execute();
            // $combinacionesLogger->debug('venta actualizada', $vars);

        }
    }


    private static function updatePrecioCompra($articulo, $codcaract)
    {


        foreach ($articulo['compra'] as $key => $precioCompra) {
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $precioCompra['VALORCARACT'],
                'preciocoste' => (float) $precioCompra['value'],
            ];

            $sql = 'UPDATE compra 
                    SET preciocoste = ' . (float) $vars['preciocoste'] . '
                    WHERE codarticulo = \'' . $vars['codarticulo'] . '\' 
                    AND codcaract = \'' . $vars['codcaract'] . '\' 
                    AND valorcaract = \'' . $vars['valorcaract'] . '\'';
            $stmt = static::$firebird->prepare($sql);

            return $stmt->execute();
            // $combinacionesLogger->debug('compra actualizada', $vars);


        }
    }
    private static function updateCodBar($articulo, $codcaract)
    {


        foreach ($articulo['codbar'] as $key => $codigoBarras) {
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $codigoBarras['VALORCARACT'],
                'codbarras' => (int) $codigoBarras['value'],
            ];


            $sql = 'UPDATE codbarra 
                    SET codbarras = ' . (int) $vars['codbarras'] . '
                    WHERE codarticulo = \'' . $vars['codarticulo'] . '\' 
                    AND codcaract = \'' . $vars['codcaract'] . '\' 
                    AND valorcaract = \'' . $vars['valorcaract'] . '\'';
            $stmt = static::$firebird->prepare($sql);

            return $stmt->execute();
            // $combinacionesLogger->debug('codigo de barras actualizado', $vars);


        }
    }

    private static function updateInhabilitar($articulo, $codcaract)
    {

        $success = false;
        $codarticulo = $articulo['COD'];

        $sql = 'SELECT valorcaract, excluirweb FROM carvaliddeshabilitado 
        WHERE codobjeto = \'' . $codarticulo . '\' 
        AND codcaract = \'' . $codcaract . '\'';

        $stmt = static::$firebird->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $excluirwebs = [];
        foreach ($result as $row) {
            $excluirwebs[$row['VALORCARACT']] = $row['EXCLUIRWEB'];
        }

        foreach ($articulo['deshab'] as $key => $inhabilitar) {
            if (isset($excluirwebs[$inhabilitar['value']])) {

                $vars = [
                    'codarticulo' => $articulo['COD'],
                    'codcaract' => $codcaract,
                    'valorcaract' => $inhabilitar['value'],
                    'excluirweb' => 'T',
                ];

                $sql = 'UPDATE carvaliddeshabilitado 
                        SET excluirweb = \'' . $vars['excluirweb'] . '\' 
                        WHERE codobjeto = \'' . $vars['codarticulo'] . '\' 
                        AND codcaract = \'' . $vars['codcaract'] . '\' 
                        AND valorcaract = \'' . $vars['valorcaract'] . '\'';
                $stmt = static::$firebird->prepare($sql);


                $success = $stmt->execute();
                // $combinacionesLogger->debug('carvaliddeshabilitado actualizada', $vars);
                unset($excluirwebs[$inhabilitar['value']]);
            } else {
                $vars = [
                    'codclase' => 0,
                    'codobjeto' => $articulo['COD'],
                    'codcaract' => $codcaract,
                    'valorcaract' => $inhabilitar['value'],
                    'deshabilitado' => 'F',
                    'excluirweb' => 'T',
                ];

                $sql = 'INSERT INTO carvaliddeshabilitado 
                        (codclase, codobjeto, codcaract, valorcaract, deshabilitado, excluirweb)
                        VALUES
                        (' . (int)$vars['codclase'] . ', 
                        \'' . $vars['codobjeto'] . '\', 
                        \'' . $vars['codcaract'] . '\', 
                        \'' . $vars['valorcaract'] . '\', 
                        \'' . $vars['deshabilitado'] . '\', 
                        \'' . $vars['excluirweb'] . '\')';
                $stmt = static::$firebird->prepare($sql);

                $success = $stmt->execute();
                // $combinacionesLogger->debug('carvaliddeshabilitado insertada', $vars);
            }
        }
        foreach ($excluirwebs as $key => $excluirweb) {
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $key,
            ];

            $sql = 'DELETE FROM carvaliddeshabilitado 
                    WHERE codobjeto = \'' . $vars['codarticulo'] . '\' 
                    AND codcaract = \'' . $vars['codcaract'] . '\' 
                    AND valorcaract = \'' . $vars['valorcaract'] . '\'';
            $stmt = static::$firebird->prepare($sql);

            $success = $stmt->execute();
            // $combinacionesLogger->debug('carvaliddeshabilitado eliminada', $vars);
        }
        return $success;
    }
    public static function update($company, $articulo)
    {

        if (!static::$firebird) {

            static::$firebird = PymeConnection::start(Constants::get($company));
        }

        $codcaract =   self::getCodCaract($articulo);

        $result = false;

        $result = self::updateArticulos($articulo);

        $result =  self::updateCompra($articulo);

        $result =  self::updateCarValor($articulo, $codcaract);

        if ($articulo['hombre/mujer'] && $articulo['cat.web']) {

            $result = self::updateCategoriaWeb($articulo);
        };

        if (isset($articulo['venta'])) {

            $result = self::updatePrecioVenta($articulo, $codcaract);
        };
        if (isset($articulo['compra'])) {

            $result = self::updatePrecioCompra($articulo, $codcaract);
        };
        if (isset($articulo['codbar']) && $codcaract) {

            $result =  self::updateCodBar($articulo, $codcaract);
        };
        if (isset($articulo['deshab'])) {

            $result = self::updateInhabilitar($articulo, $codcaract);
        };

        return $result;
    }


    // private static function insertArticulos($articulo)
    // {
    //     $sql = 'insert into articulo
    //     (codigo, codmarca, nombre, codfamilia, baja, descripcion, preciocoste, precioventa, tipoactualizacion, tipoiva, tipoivareducido, tipoivacompra, tipoivacomprareducido, controlstock, unidaddecimales, preciodecimales, costedecimales, stockfactor, etiquetasegununidadmedida, proveeddefecto, ubicacion, descripcioncorta, formatodesccorta, formatodescripcion, metakeywords, aplicarinvsujetopasivo, tipobc3, unidadcontrolcarubicstock, excluirweb)
    //         values
    //         (:codigo, :codmarca, :nombre, :codfamilia, :baja, :descripcion, :preciocoste, :precioventa, :tipoactualizacion, :tipoiva, :tipoivareducido, :tipoivacompra, :tipoivacomprareducido, :controlstock, :unidaddecimales, :preciodecimales, :costedecimales, :stockfactor, :etiquetasegununidadmedida, :proveeddefecto, :ubicacion, :descripcioncorta, :formatodesccorta, :formatodescripcion, :metakeywords, :aplicarinvsujetopasivo, :tipobc3, :unidadcontrolcarubicstock, :excluirweb)';
    //     $stmt = static::$firebird->prepare($sql);
    //     $vars = [
    //         'codigo' => (string) $articulo['COD'],
    //         'codmarca' => (int) $articulo['marca'],
    //         'nombre' => (string) $articulo['nombre'],
    //         'descripcion' => (string) utf8_decode($articulo['nombre'] .
    //             '<br><br>' .
    //             $articulo['metakeywords'] .
    //             ',' .
    //             $hombreMujer .
    //             ',' .
    //             $categoriaWeb),
    //         'preciocoste' => (float) $articulo['preciocoste'],
    //         'precioventa' => (float) $articulo['pva'],
    //         'codfamilia' => (float) $articulo['familia'],
    //         'baja' => 'F',
    //         'tipoactualizacion' => 0,
    //         'tipoiva' => 0,
    //         'tipoivareducido' => 1,
    //         'tipoivacompra' => 0,
    //         'tipoivacomprareducido' => 1,
    //         'controlstock' => 1,
    //         'unidaddecimales' => 0,
    //         'preciodecimales' => 2,
    //         'costedecimales' => 2,
    //         'stockfactor' => 1,
    //         'etiquetasegununidadmedida' => 0,
    //         'proveeddefecto' => (int) $articulo['proveedor'],
    //         'ubicacion' => 0,
    //         'descripcioncorta' => $articulo['nombre'],
    //         'formatodesccorta' => 0,
    //         'formatodescripcion' => 2,
    //         'metakeywords' => $articulo['metakeywords'],
    //         'aplicarinvsujetopasivo' => 0,
    //         'tipobc3' => 20,
    //         'unidadcontrolcarubicstock' => 0,
    //         'excluirweb' => 'T',
    //     ];
    //     $stmt->execute($vars);
    //     $vars['descripcion'] = $articulo['nombre'] .
    //         '<br><br>' .
    //         $articulo['metakeywords'] .
    //         ',' .
    //         $hombreMujer .
    //         ',' .
    //         $categoriaWeb;
    //     $combinacionesLogger->debug('Articulo insertado', $vars);
    // }
    // private static function insertCompra($articulo)
    // {
    // }
    // private static function insertCategoriaweb($articulo)
    // {
    // }
    // private static function insertCarValor($articulo)
    // {
    // }
    // private static function insertPrecioVenta($articulo)
    // {
    // }
    // private static function insertPrecioCompra($articulo)
    // {
    // }
    // private static function insertCodBar($articulo)
    // {
    // }
    // private static function insertInhabilitar($articulo)
    // {
    // }



    // public static function insert($company, $articulo)
    // {
    //     if (!static::$firebird) {

    //         static::$firebird = PymeConnection::start(Constants::get($company));
    //     }

    //     $codcaract =   self::getCodCaract($articulo);

    //     $result = false;

    //     self::insertArticulos($articulo);
    //     self::insertCompra($articulo);
    //     self::insertCategoriaWeb($articulo);
    //     self::insertCarValor($articulo);

    //     if (isset($articulo['venta'])) {

    //         self::insertPrecioVenta($articulo, $codcaract);
    //     };
    //     if (isset($articulo['compra'])) {

    //         self::insertPrecioCompra($articulo, $codcaract);
    //     };
    //     if (isset($articulo['codbar'])) {

    //         self::insertCodBar($articulo, $codcaract);
    //     };
    //     if (isset($articulo['deshab'])) {

    //         self::insertInhabilitar($articulo, $codcaract);
    //     };
    // }
}

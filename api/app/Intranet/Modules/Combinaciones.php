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

        function getCompraVenta($arr, $codBarra, $priceKeyName = 'PRECIOCOSTE')
        {


            return array_map(function ($cod) use ($arr, $priceKeyName) {


                foreach ($arr as $key => $value) {

                    if ($value["VALORCARACT"] !== $cod["VALORCARACT"]) continue;
                    return [

                        "VALORCARACT" => $value["VALORCARACT"],
                        'hasPrice' => true,
                        'PRECIO' => Utils::roundTo($value[$priceKeyName], 2)

                    ];
                }
                return [
                    "VALORCARACT" => $cod["VALORCARACT"],
                    'hasPrice' => false,
                    'PRECIO' => null
                ];
            }, $codBarra);
        }

        // all keys from the api start with  S,A,T,OR C 
        // S: The value of that key is a simple string or number.
        // A: The value is an Array.
        // T: The value is a Tree.
        // C: The value depends on combinations.


        $dataOfdataFormated = [];

        foreach ($data as  $d) {

            $comb = getComb($d['COLOR'], $d['TALLA']);
            $codBarra = array_map(function ($cod) use ($comb) {

                foreach ($comb as $key => $value) {

                    if ($cod["VALORCARACT"] !== $value) continue;

                    return $cod;
                }
            }, $d['CODBARRAS']);

            $precio = null;
            $descuento = '';
            foreach ($d['COMPRA'] as $key => $val) {

                if ($val['CODPROVEEDOR'] !== $d['PROVEEDDEFECTO']) continue;
                $precio = Utils::roundTo((int)$val['DESCUENTO'] / 100  * (float)$d['PRECIOCOSTE'] + (float)$d['PRECIOCOSTE'], 2);
                $descuento =  $val['DESCUENTO'];
                break;
            }

            $pCompra = getCompraVenta($d['COMPRA'], $codBarra);

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
                            'readonly' => false
                        ];
                        $dataFormated['A_marca'] = [
                            'id' => $d['CODMARCA'],
                            'data' =>  $marca,
                            'readonly' => false
                        ];
                        $dataFormated['A_proveed'] = [
                            'id' => $d['PROVEEDDEFECTO'],
                            'data' =>  $proveedor,
                            'readonly' => false
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
                            'data' =>   $precio,
                            'readonly' => false,
                        ];
                        $dataFormated['S_des'] = [
                            'id' => '',
                            'data' =>  $descuento,
                            'readonly' => false,
                        ];

                        $dataFormated['S_coste'] = [
                            'id' => '',
                            'data' =>  Utils::roundTo($value, 2),
                            'readonly' => true,
                        ];
                        $dataFormated['S_marg'] = [
                            'id' => '',
                            'data' =>  Utils::percentageBtwNumbers($value, $d['PRECIOVENTA']),
                            'readonly' => false,
                        ];
                        $dataFormated['S_P.V.A'] = [
                            'id' => '',
                            'data' =>  Utils::roundTo($d['PRECIOVENTA'], 2),
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

        return $dataOfdataFormated;
    }

    private static function getHombreMujer($articulo)
    {
        $hombreMujer = $articulo["hombre/mujer"];

        $sql = 'select codigo, nombre from webgrupocategoria where codigo = :codigo';
        $stmt =  static::$firebird->prepare($sql);
        $stmt->execute(['codigo' => $hombreMujer]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]['NOMBRE'];
    }
    private static function getCategoriaWeb($articulo)
    {
        $sql = 'select codgrupocategoria, codigo, codpadre, nombre, orden from webcategoria
        where codgrupocategoria = :codgrupocategoria
        and codigo = :codigo';
        $stmt =  static::$firebird->prepare($sql);
        $stmt->execute([
            'codgrupocategoria' => $articulo["hombre/mujer"],
            'codigo' => $articulo["cat.web"]
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $categoriaWeb = $result[0]['NOMBRE'];

        while ($result[0]['CODPADRE'] != 0) {
            $sql = 'select codgrupocategoria, codigo, codpadre, nombre, orden from webcategoria
            where codgrupocategoria = :codgrupocategoria
            and codigo = :codigo';
            $stmt =  static::$firebird->prepare($sql);
            $stmt->execute([
                'codgrupocategoria' => $articulo["hombre/mujer"],
                'codigo' => $result[0]['CODPADRE']
            ]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $categoriaWeb = $result[0]['NOMBRE'] . '/' . $categoriaWeb;
        }
        return $categoriaWeb;
    }
    private static function getCodCaract($articulo)
    {
        $sql = "select * from carvalid
        left join caract on caract.codcaract = carvalid.codcaract and caract.dimension = carvalid.dimension
        where codobjeto = :codigo
        and caract.nombre like 'COLOR%'";
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute([
            'codigo' => $articulo['COD'],
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]['CODCARACT'];
    }

    public static function update($company, $articulo)
    {

        if (!static::$firebird) {

            static::$firebird = PymeConnection::start(Constants::get($company));
        }

        $codcaract =   self::getCodCaract($articulo);

        $result = false;

        self::updateArticulos($articulo);
        self::updateCompra($articulo);
        self::updateCategoriaWeb($articulo);
        self::updateCarValor($articulo);
        
        if (isset($articulo['venta'])) {

            self::updatePrecioVenta($articulo, $codcaract);
        };
        if (isset($articulo['compra'])) {

            self::updatePrecioCompra($articulo, $codcaract);
        };
        if (isset($articulo['codbar'])) {

            self::updateCodBar($articulo, $codcaract);
        };
        if (isset($articulo['deshab'])) {

            self::updateInhabilitar($articulo, $codcaract);
        };
    }


    private static function updateArticulos($articulo)
    {

        $hombreMujer = self::getHombreMujer($articulo);

        $categoriaWeb = self::getCategoriaWeb($articulo);

        $sql = 'update articulo set
        codmarca = :codmarca,
        descripcion = :descripcion,
        preciocoste = :preciocoste,
        precioventa = :precioventa,
        codfamilia = :codfamilia,
        metakeywords = :metakeywords
        where codigo = :codigo';
        $stmt = static::$firebird->prepare($sql);

        $vars = [
            'codmarca' => (int) $articulo['marca'],
            'descripcion' => (string) utf8_decode($articulo['nom'] .
                '<br><br>' .
                $articulo['metakey'] .
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

        $stmt->execute($vars);
    }
    private static function updateCompra($articulo)
    {
        $sql = 'update compra set preciocoste =:preciocoste, preciotarifa = :preciotarifa, descuento = :descuento
        where codarticulo = :codarticulo and codproveedor = :codproveedor';
        $stmt = static::$firebird->prepare($sql);
        $vars = [
            'codarticulo' => (string) $articulo['COD'],
            'codproveedor' => (int) $articulo['proveed'],
            'preciocoste' => (float) $articulo['coste'],
            'preciotarifa' => (float) $articulo['precio'],
            'descuento' => (float) $articulo['des'],
        ];
        return $vars;
        $stmt->execute($vars);
        // $combinacionesLogger->debug('Compra actualizada', $vars);
    }

    private static function updateCategoriaWeb($articulo)
    {

        $sql = 'update webcategoriaarticulo set codgrupocategoria = :codgrupocategoria, codcategoria = :codcategoria
        where codarticulo = :codarticulo';
        $stmt = static::$firebird->prepare($sql);
        $vars = [
            'codarticulo' => $articulo['COD'],
            'codgrupocategoria' => $articulo["hombre/mujer"],
            'codcategoria' => $articulo["cat.web"]
        ];
        $stmt->execute($vars);
        // $combinacionesLogger->debug('Categoriasweb actualizada', $vars);
    }

    private static function updateCarValor($articulo)
    {

        $sql = 'select codcaract from caract where codclase=2 and nombre=:temporada';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute([
            'temporada' => 'Temporada'
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($result) > 0) {
            $codcaract = $result[0]['CODCARACT'];

            //temporada
            $sql = 'update carvalor set valor = :valor
                    where codobjeto = :codobjeto and codclase = :codclase and codcaract = :codcaract';
            $stmt =  static::$firebird->prepare($sql);
            $vars = [
                'codclase' => 2,
                'codobjeto' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valor' => $articulo['temporada'],
            ];
            $stmt->execute($vars);


            //coleccion
            $stmt2 = static::$firebird->prepare($sql);
            $vars2 = [
                'codclase' => 2,
                'codobjeto' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valor' => $articulo['coleccion'],
            ];
            $stmt2->execute($vars2);
            // $combinacionesLogger->debug('Carvalor Temporada actualizada', $vars);

        }
    }

    private static function updatePrecioVenta($articulo, $codcaract)
    {




        foreach ($articulo['venta'] as $key => $precioVenta) {


            $sql = 'update venta set precio = :precio where codarticulo = :codarticulo and codcaract = :codcaract and valorcaract = :valorcaract';
            $stmt = static::$firebird->prepare($sql);
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $precioVenta['VALORCARACT'],
                'precio' => (float) $precioVenta['value'],
            ];
            $stmt->execute($vars);
            // $combinacionesLogger->debug('venta actualizada', $vars);

        }
    }


    private static function updatePrecioCompra($articulo, $codcaract)
    {


        foreach ($articulo['compra'] as $key => $precioCompra) {

            $sql = 'update compra set preciocoste = :preciocoste where codarticulo = :codarticulo and codcaract = :codcaract and valorcaract = :valorcaract';
            $stmt = static::$firebird->prepare($sql);
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $precioCompra['VALORCARACT'],
                'preciocoste' => (float) $precioCompra['value'],
            ];
            $stmt->execute($vars);
            // $combinacionesLogger->debug('compra actualizada', $vars);


        }
    }
    private static function updateCodBar($articulo, $codcaract)
    {


        foreach ($articulo['codbar'] as $key => $codigoBarras) {


            $sql = 'update codbarra set codbarras = :codbarras where codarticulo = :codarticulo and codcaract = :codcaract and valorcaract = :valorcaract';
            $stmt = static::$firebird->prepare($sql);
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $codigoBarras['VALORCARACT'],
                'codbarras' => (float) $codigoBarras['value'],
            ];
            $stmt->execute($vars);
            // $combinacionesLogger->debug('codigo de barras actualizado', $vars);


        }
    }

    private static function updateInhabilitar($articulo, $codcaract)
    {


        $sql = 'select valorcaract, excluirweb from carvaliddeshabilitado where codobjeto = :codarticulo and codcaract = :codcaract';
        $stmt = static::$firebird->prepare($sql);
        $stmt->execute([
            'codarticulo' => $articulo['COD'],
            'codcaract' => $codcaract,
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $excluirwebs = [];
        foreach ($result as $row) {
            $excluirwebs[$row['VALORCARACT']] = $row['EXCLUIRWEB'];
        }

        foreach ($articulo['deshab'] as $key => $inhabilitar) {
            if (isset($excluirwebs[$inhabilitar])) {
                $sql = 'update carvaliddeshabilitado set excluirweb = :excluirweb where codobjeto = :codarticulo and codcaract = :codcaract and valorcaract = :valorcaract';
                $stmt = static::$firebird->prepare($sql);
                $vars = [
                    'codarticulo' => $articulo['COD'],
                    'codcaract' => $codcaract,
                    'valorcaract' => $inhabilitar['value'],
                    'excluirweb' => 'T',
                ];
                $stmt->execute($vars);
                // $combinacionesLogger->debug('carvaliddeshabilitado actualizada', $vars);
                unset($excluirwebs[$inhabilitar]);
            } else {
                $sql = 'insert into carvaliddeshabilitado
                    (codclase, codobjeto, codcaract, valorcaract, deshabilitado, excluirweb)
                    values
                    (:codclase, :codobjeto, :codcaract, :valorcaract, :deshabilitado, :excluirweb)';
                $stmt = static::$firebird->prepare($sql);
                $vars = [
                    'codclase' => 0,
                    'codobjeto' => $articulo['COD'],
                    'codcaract' => $codcaract,
                    'valorcaract' => $inhabilitar['value'],
                    'deshabilitado' => 'F',
                    'excluirweb' => 'T',
                ];
                $stmt->execute($vars);
                // $combinacionesLogger->debug('carvaliddeshabilitado insertada', $vars);
            }
        }
        foreach ($excluirwebs as $key => $excluirweb) {
            $sql = 'delete from carvaliddeshabilitado where codobjeto = :codarticulo and codcaract = :codcaract and valorcaract = :valorcaract';
            $stmt = static::$firebird->prepare($sql);
            $vars = [
                'codarticulo' => $articulo['COD'],
                'codcaract' => $codcaract,
                'valorcaract' => $key,
            ];
            $stmt->execute($vars);
            // $combinacionesLogger->debug('carvaliddeshabilitado eliminada', $vars);
        }
    }
}

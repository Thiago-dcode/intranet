<?php

namespace App\Intranet\Utils;


class Utils
{


    public static function objectToArray($obj)
    {


        if (!is_object($obj) && is_array($obj)) return $obj;

        return json_decode(json_encode($obj), true);
    }
    public static function createEnvVar($key, $value)
    {
        if (env($key)) return;
        $envFile =   file_get_contents(Path::ROOT . 'api/.env');
        $newVar = "\n" . $key . '=' . $value . "\n";

        $newEnvFile = $envFile . $newVar;

        file_put_contents(Path::ROOT . 'api/.env', $newEnvFile);
    }
}

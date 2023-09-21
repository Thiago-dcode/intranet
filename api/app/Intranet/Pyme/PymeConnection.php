<?php



namespace App\Http\Controllers\Intranet\Pyme;





class PymeConnection {


    
    const DBHOST = '141.95.252.198:C:\Distrito\Pyme\Database\BERA200\2020.FDB';
    const DBUSER = 'sysdba';
    const DBPASSWORD = 'masterkey';

    static $firebird = null;

    private static function startConnection()
    {

        if (!self::$firebird) {
            try {
                self::$firebird = new \PDO(FB_HOST, FB_USERNAME, FB_PW, [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]);
            } catch (PDOException $e) {
                die('<b>Errors:</b> ' . $e->getMessage());
            }
        }
        return self::$firebird;
    }




}
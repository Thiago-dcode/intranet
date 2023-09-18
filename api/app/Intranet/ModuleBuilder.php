<?php

namespace App\Intranet;

use App\Models\Module;

class ModuleBuilder
{



    public static function generateRoutes($modules)
    {
       

        $path = __DIR__ . '/../../../react/src/moduleRegister.jsx';
        $openArr= "\r\n export const modules = [\r\n";
        $closeArr = "];\r\n";
        $import= '';
        $moduleObject = '' ;

        foreach ($modules as $key => $module) {

            $import .= "import ".  ucfirst($module['name']) . " from './Intranet/views/modules/" .  ucfirst($module['name']) . "';\r\n";
            $moduleObject .= "{\r\n path: '" . $module['name']. "' ,\r\nelement: <".ucfirst($module['name'])." />,\r\n},\r\n";
        }   
       
        $content = $import . $openArr . $moduleObject . $closeArr;

        

        return  file_put_contents($path,$content);;


    }
    public static function generateView($module){
        $moduleName =  ucfirst($module['name']);
        $path = __DIR__ . "/../../../react/src/Intranet/views/modules/$moduleName.jsx";

         if(file_exists($path)) return;

        $content = "import React from 'react';\r\nexport default  function $moduleName(){\r\nreturn <div>$moduleName</div>;\r\n};";
       

        return  file_put_contents($path,$content);;

    }

 
}

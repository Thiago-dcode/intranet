<?php

namespace App\Intranet\Utils;

use App\Intranet\Utils\Path;
use App\Intranet\Utils\Utils;
use App\Models\Module;

class ModuleBuilder
{



    public static function generateFrontEndRoutes($modules)
    {


        $path = Path::ROOT . 'react/src/moduleRegister.jsx';
        $openArr = "\r\n export const modules = [\r\n";
        $closeArr = "];\r\n";
        $import = '';
        $moduleObject = '';

        foreach ($modules as $key => $module) {

            $module = Utils::objectToArray($module);
            $import .= "import " .  ucfirst($module['name']) . " from './Intranet/views/modules/" .  ucfirst($module['name']) . "';\r\n";
            $moduleObject .= "{\r\n path: '" . $module['route'] . "' ,\r\nelement: <" . ucfirst($module['name']) . " />,\r\n},\r\n";
        }

        $content = $import . $openArr . $moduleObject . $closeArr;



        return  file_put_contents($path, $content);;
    }
    public static function generateApiRoutes($modules)
    {


        $path = Path::ROOT . 'api/routes/modules.php';
        $open = '<?php
use App\Intranet\Utils\Utils;';

        $import = '';

        $middle = '
       
       function moduleRoutes($modules){
        
            foreach ($modules as $key => $module) {
              
                $module= Utils::objectToArray($module);
               
             switch ( $module["name"]) {';


        $close = '
            default:
             # code...
             break;
     }

     require_once __DIR__ . "/modulesCustomRoutes.php";
     customModulesRoutes($module["name"]);
     
    }
    
   

}';
        $switchConditional = '';
        $moduleObject = '';

        foreach ($modules as $key => $module) {

            $module = Utils::objectToArray($module);
            $moduleName = $module['name'];
            $moduleNameCapitalize = ucfirst($moduleName);
            $route = "/modules/" .  $moduleName;
            $import .= "\r\nuse App\Http\Controllers\Intranet\Modules" . "\\$moduleNameCapitalize" . 'Controller;';
            $switchConditional .= "
            case '$moduleName':
           Route::get( '{company:name}$route',[App\Http\Controllers\Intranet\Modules" . "\\$moduleNameCapitalize" . "Controller::class,'index']);
                 break;\r\n";
        }

        $content = $open . $import . $middle . $switchConditional . $close;



        return  file_put_contents($path, $content);;
    }

    public static function generateView($module)
    {
        $module = Utils::objectToArray($module);
        $moduleName =  ucfirst($module['name']);
        $path = Path::ROOT . "react/src/Intranet/views/modules/$moduleName.jsx";

        if (file_exists($path)) return;

        $content = "import React from 'react';\r\nimport Icon from '../../components/icon/Icon';\r\nexport default  function $moduleName(){\r\nreturn <div className='text-2xl mt-20 flex items-center gap-2'><span>{`Próximamente `}</span><Icon icon={'Wrench'}/> </div>;}";


        return  file_put_contents($path, $content);
    }

    public static function generateController($module)
    {
        $name = '$name';
        $request = ', Request $request';
        $args = $name . $request;
        $conditional = 'if($request->user()->company_active !== $name){

                                return response("",401);
                        }';
        $module = Utils::objectToArray($module);
        $moduleName =  ucfirst($module['name']);
        $path =  Path::ROOT . "api/app/Http/Controllers/Intranet/Modules/$moduleName" . "Controller.php";
        if (file_exists($path)) return;
        $content = "<?php\r\n
                    namespace App\Http\Controllers\Intranet\Modules;\r\n
       
       use Illuminate\Http\Request;\r\n
       use App\Traits\HttpResponses;\r\n
       use App\Http\Controllers\Controller;\r\n
       
       class {$moduleName}Controller extends Controller\r\n
       {\r\n
            
               use HttpResponses;\r\n
               \r\n
               public function index($args){\r\n
                
                
                    $conditional

                    return response(\"$moduleName module for campany $name created successfully.\");
                    //start your logic here
        
                }\r\n
       }";
        return file_put_contents($path, $content);
    }
}

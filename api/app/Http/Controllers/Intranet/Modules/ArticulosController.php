<?php

namespace App\Http\Controllers\Intranet\Modules;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;

use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Dotenv\Exception\ValidationException;
use Illuminate\Console\Scheduling\Schedule;

class ArticulosController extends Controller
{

        use HttpResponses;

        public function index(){


                return $this->success([
                        'data'=> 'articulos module'
            
                    ], 'Articulo module');


        }
}
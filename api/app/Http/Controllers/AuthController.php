<?php

namespace App\Http\Controllers;


use App\Models\User;
use App\Models\Module;
use App\Models\Company;
use App\Models\ModuleUser;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Intranet\Modules\ModuleBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Dotenv\Exception\ValidationException;
use Illuminate\Console\Scheduling\Schedule;

class AuthController extends Controller
{
    use HttpResponses;

    public function login(Request $request, Schedule $schedule)
    {


        $fields = $request->validate([
            'email' => 'required|max:255',
            'password' => 'required',
        ]);

        if (!Auth::attempt($fields)) {
            return $this->error('', 'Credenciales errónea', 422);
        }
        $user = Auth::user();
        User::where('id', $user->id)->update(['company_active' => null,'module_active' => null]);

        return $this->success([

            'user' => $user,
            'token' => $user->createToken('Api Token of ' . $user->name)->plainTextToken

        ], 'Inicio de sesión exitoso');
    }
    public function register(Request $resquest)
    {
    }
    public function logout(Request $request)
    {

        $user = User::where('id', $request->user()->id)->update(['company_active' => null,'module_active' => null]);

        Auth::guard('web')->logout();


        return response([
            'success' => true
        ]);
    }
    public function me(Request $request)
    {
        
       
        return $request->user();
    }

    public function activeCompany(Request $request)
    {


        if (!isset($request["company"])) {
            return $this->error('', '', 401);
        }
        
        if(!User::find($request['user_id'])->companies()->where('name', $request['company'])->first()){

            return $this->error('', '', 401);

        }
        User::where('id', $request['user_id'])->update(['company_active' => $request['company']]);


        return $this->success([
            'id' => $request['user_id'],
            'user' => User::find($request['user_id']),


        ], '');
    }
    public function activeModule(Request $request)
    {


        if (!isset($request["module"])) {

            return $this->error('', '', 401);
        }

   if(!ModuleUser::findUserModule( $request->user()->id, $request->user()->company_active,$request['module'])){

    return $this->error('', '', 401);
   };
       
        User::where('id', $request->user()->id)->update(['module_active' => $request['module']]);


        return $this->success([
            'id' => $request['user_id'],
            'user' => User::find($request['user_id']),


        ], '');
    }
    public function company(Request $request){

            $company = Company::where('name', $request->user()->company_active)->firstOrFail();

            if(!$company) return \response('',401);
            return \response($company);
    }

    public function modules(Request $request)
    {


        
        $modules = ModuleUser::allUserModulesByCompany($request->user()->id,$request->user()->company_active);
        return $this->success([

            'modules' => $modules,


        ], '');
    }
}

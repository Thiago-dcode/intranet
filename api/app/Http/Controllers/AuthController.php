<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Dotenv\Exception\ValidationException;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
        Auth::guard('web')->logout();


        return response([
            'success' => true
        ]);
    }
    public function me(Request $request)
    {
        return $request->user();
    }
    public function company(Request $request)
    {
        if (!isset($request["company"])) {
            return $this->error('', '', 401);
        }

        foreach ($request->user()['companies'] as $company) {

            if ($company['name'] !== $request["company"]) continue;

            $company = Company::where('name', '=', $request["company"])->firstOrFail();
            return $this->success([

                'company' => $company,


            ], '');
        }
        return $this->error('', 'Credenciales errónea', 404);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
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
            return $this->error('', 'Credenciales errónea', 401);
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
    public function logout(Request $resquest)
    {

        return Auth::logout();
        Auth::user()->currentAccessToken()->delete();
        return  response()->json([
            'message' => 'token deleted successfully'
        ]);
    }
}

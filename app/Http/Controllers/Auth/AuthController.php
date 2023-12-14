<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        try {
            // Validación de los datos de entrada
            $validate = Validator::make($request->all(), [
                'name' => 'required|string|max:250',
                'email' => 'required|string|email:rfc,dns|max:250|unique:users,email',
                'password' => 'required|string|min:8',
                'departamento_id' => 'required|integer|exists:departamentos,id',
                'especialidad_id' => 'required|integer|exists:especialidads,id',
                'rol' => 'required|string'
            ]);
    
            if ($validate->fails()) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'Validation Error!',
                    'data' => $validate->errors(),
                ], 403);
            }
    
            // Creación del usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'departamento_id' => $request->departamento_id,
                'especialidad_id' => $request->especialidad_id,
                'rol' => $request->rol
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'User is created successfully.',
                'data' => ['user' => $user],
            ], 201);
        } catch (\Exception $e) {
            // Captura de la excepción
            return response()->json([
                'status' => 'error',
                'message' => 'Server Error!',
                'data' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Authenticate the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Validation Error!',
                'data' => $validate->errors(),
            ], 403);
        }

        // Check email exist
        $user = User::where('email', $request->email)->with('especialidad', 'departamento')->first();


        // Check password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Te has equivocado en el email o la'
            ], 401);
        }

        $data['token'] = $user->createToken($request->email)->plainTextToken;
        $data['user'] = $user;

        $response = [
            'status' => 'success',
            'message' => 'User is logged in successfully.',
            'data' => $data,
        ];

        return response()->json($response, 200);
    }

    /**
     * Log out the user from application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User is logged out successfully'
        ], 200);
    }

    public function getAllUsers()
    {
        $users = User::all();

        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }
};

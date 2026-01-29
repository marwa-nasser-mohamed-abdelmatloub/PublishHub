<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'author',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return $this->createdResponse(
            [
                'user' => new UserResource($user),
                'token' => $token,
            ],
            "User registered successfully"
        );
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return $this->unauthorizedResponse("Invalid credentials");
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return $this->successResponse(
            [
                'user' => new UserResource($user),
                'token' => $token,
            ],
            "User logged in successfully"
        );
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(
            null,
            'User logged out successfully'
        );
    }

    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            new UserResource($request->user()),
            'User retrieved successfully'
        );
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string|max:1000',
        ]);

        $request->user()->update($validated);

        return $this->successResponse(
            new UserResource($request->user()),
            'Profile updated successfully'
        );
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/',
            'password_confirmation' => 'required|string|same:password',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return $this->unprocessableResponse(
                'Current password is incorrect',
                ['current_password' => ['The current password is incorrect']]
            );
        }

        if (Hash::check($validated['password'], $user->password)) {
            return $this->validationErrorResponse(['password' => ['New password must be different from current password']]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return $this->successResponse(
            new UserResource($user),
            'Password changed successfully'
        );
    }
}
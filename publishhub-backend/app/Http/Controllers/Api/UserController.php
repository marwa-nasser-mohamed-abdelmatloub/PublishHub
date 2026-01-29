<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Get all users (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::paginate(15);
        return $this->successResponse(
            UserResource::collection($users),
            "Users retrieved successfully"
        );
    }

    /**
     * Show a specific user
     */
    public function show(User $user): JsonResponse
    {
        return $this->successResponse(
            new UserResource($user),
            "User retrieved successfully"
        );
    }

    /**
     * Get users by role (Admin only)
     */
    public function getByRole(Request $request): JsonResponse
    {
        $role = $request->query('role');

        if (!in_array($role, ['admin', 'author', 'reviewer'])) {
            return $this->validationErrorResponse([
                'role' => ['Invalid role provided']
            ]);
        }

        $users = User::where('role', $role)->paginate(15);
        return $this->successResponse(
            UserResource::collection($users),
            "Users retrieved successfully"
        );
    }

    /**
     * Create a new user (Admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/',
            'role' => 'required|in:admin,author,reviewer',
        ], [
            'password.regex' => 'Password must contain uppercase, lowercase, number, and special character',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return $this->createdResponse(
            new UserResource($user),
            "User created successfully"
        );
    }

    /**
     * Update a user (Admin only)
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:admin,author,reviewer',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user->update($validated);

        return $this->successResponse(
            new UserResource($user),
            "User updated successfully"
        );
    }

    /**
     * Delete a user (Admin only)
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->successResponse(
            null,
            "User deleted successfully"
        );
    }
}

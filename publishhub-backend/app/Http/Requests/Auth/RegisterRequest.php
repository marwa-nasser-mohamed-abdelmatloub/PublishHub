<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Enums\UserRole;
use App\Traits\ApiResponse;

class RegisterRequest extends FormRequest
{
    use ApiResponse;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\@\$\!\%\*\?&]).+$/',
                'confirmed',
            ],
            'role' => ['required', new Enum(UserRole::class)],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required',
            'name.string' => 'Full name must be a string',
            'name.min' => 'Full name must be at least 3 characters',
            'name.max' => 'Full name cannot exceed 255 characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Invalid email address',
            'email.unique' => 'This email is already registered',
            'password.required' => 'Password is required',
            'password.string' => 'Password must be a string',
            'password.min' => 'Password must be at least 8 characters long',
            'password.regex' => 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long',
            'password.confirmed' => 'Passwords do not match',
            'role.required' => 'User role is required',
            'role.enum' => 'Invalid user role',
        ];
    }

    /**
     * Get the sanitized input
     */
    public function validated($key = null, $default = null)
    {
        return parent::validated($key, $default);
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException($this->errorResponse(
            'Validation failed',
            422,
            $validator->errors()->toArray()
        ));
    }
}
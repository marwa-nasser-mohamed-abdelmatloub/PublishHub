<?php

namespace App\Http\Requests\ChangeTracker;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class TrackChangeRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $article = $this->route('article');

        return $this->user()->id === $article->author_id || $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'old_content' => 'required|string|min:50',
            'new_content' => 'required|string|min:50',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'old_content.required' => 'Old content is required',
            'old_content.min' => 'Old content must be at least 50 characters',
            'new_content.required' => 'New content is required',
            'new_content.min' => 'New content must be at least 50 characters',
        ];
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
<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class StoreRevisionRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'article_id' => 'required|exists:articles,id',
            'reason' => 'required|string|min:10|max:500',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'article_id.required' => 'Article is required',
            'article_id.exists' => 'Selected article does not exist',
            'reason.required' => 'Revision reason is required',
            'reason.min' => 'Reason must be at least 10 characters',
            'reason.max' => 'Reason must not exceed 500 characters',
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
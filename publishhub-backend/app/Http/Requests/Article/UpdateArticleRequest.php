<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class UpdateArticleRequest extends FormRequest
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
            'title' => 'sometimes|required|string|min:5|max:255',
            'content' => 'sometimes|required|string|min:50',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'title.min' => 'Article title must be at least 5 characters',
            'title.max' => 'Article title must not exceed 255 characters',
            'content.min' => 'Article content must be at least 50 characters',
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
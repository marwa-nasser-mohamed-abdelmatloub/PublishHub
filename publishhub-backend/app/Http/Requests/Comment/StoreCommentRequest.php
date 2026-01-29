<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class StoreCommentRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $article = $this->route('article');

        if (!in_array($this->user()->role, ['reviewer', 'admin'])) {
            return false;
        }

        if ($this->user()->role === 'reviewer') {
            $hasAssignment = \App\Models\ReviewAssignment::where('article_id', $article->id)
                ->where('reviewer_id', $this->user()->id)
                ->exists();
            return $hasAssignment;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'comment_text' => 'required|string|min:3|max:1000',
            'selected_text' => 'nullable|string',
            'start_position' => 'nullable|integer|min:0',
            'end_position' => 'nullable|integer|min:0',
            'highlight_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'comment_text.required' => 'Comment text is required',
            'comment_text.min' => 'Comment must be at least 3 characters',
            'comment_text.max' => 'Comment must not exceed 1000 characters',
            'selected_text.string' => 'Selected text must be a string',
            'start_position.integer' => 'Start position must be a number',
            'end_position.integer' => 'End position must be a number',
            'highlight_color.regex' => 'Highlight color must be in HEX format (e.g: #FF0000)',
        ];
    }

    /**
     * Prepare the data for validation
     */
    protected function prepareForValidation()
    {
        if (!$this->highlight_color) {
            $this->merge([
                'highlight_color' => '#FFE082'
            ]);
        }

        if (!$this->start_position) {
            $this->merge(['start_position' => 0]);
        }
        if (!$this->end_position) {
            $this->merge(['end_position' => 0]);
        }
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

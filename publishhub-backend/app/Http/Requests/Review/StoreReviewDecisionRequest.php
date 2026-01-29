<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class StoreReviewDecisionRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $article = $this->route('article');

        if (!$article) {
            $assignment = $this->route('assignment');
            if ($assignment && $assignment instanceof \App\Models\ReviewAssignment) {
                $article = $assignment->article;
            }
        }

        if (!$article) {
            return false;
        }

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
            'decision' => [
                'required',
                Rule::in(['accept', 'reject', 'request_revision']),
            ],
            'feedback' => 'nullable|string|min:10|max:1000',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'decision.required' => 'Decision is required',
            'decision.in' => 'Decision must be accept, reject, or request_revision',
            'feedback.min' => 'Feedback must be at least 10 characters',
            'feedback.max' => 'Feedback must not exceed 1000 characters',
        ];
    }

    /**
     * Validate feedback is provided for specific decisions
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (in_array($this->decision, ['reject', 'request_revision']) && !$this->feedback) {
                $validator->errors()->add('feedback', 'Feedback is required when rejecting or requesting revision');
            }
        });
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

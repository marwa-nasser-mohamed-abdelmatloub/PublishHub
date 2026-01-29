<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class AssignReviewerRequest extends FormRequest
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
            'reviewer_id' => 'required|exists:users,id',
        ];
    }

    /**
     * Validate reviewer is actually a reviewer
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $reviewer = \App\Models\User::find($this->reviewer_id);

            if ($reviewer && $reviewer->role !== 'reviewer') {
                $validator->errors()->add('reviewer_id', 'Selected user is not a reviewer');
            }

            $article = $this->route('article');
            $alreadyAssigned = \App\Models\ReviewAssignment::where('article_id', $article->id)
                ->where('reviewer_id', $this->reviewer_id)
                ->exists();

            if ($alreadyAssigned) {
                $validator->errors()->add('reviewer_id', 'This reviewer is already assigned to this article');
            }
        });
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'reviewer_id.required' => 'Reviewer is required',
            'reviewer_id.exists' => 'Selected reviewer does not exist',
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
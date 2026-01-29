<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Success response
     */
    protected function successResponse($data = null, string $message = "Success", int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Error response
     */
    protected function errorResponse(string $message, $errors = null, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'status_code' => $statusCode,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    /**
     * Created response
     */
    protected function createdResponse($data, string $message = "Resource created successfully"): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Unauthorized response
     */
    protected function unauthorizedResponse(string $message = "Unauthorized"): JsonResponse
    {
        return $this->errorResponse($message, null, 401);
    }

    /**
     * Unprocessable entity response (for validation errors)
     */
    protected function unprocessableResponse(string $message = "Unprocessable entity", $errors = null): JsonResponse
    {
        return $this->errorResponse($message, $errors, 422);
    }

    /**
     * Forbidden response
     */
    protected function forbiddenResponse(string $message = "Forbidden"): JsonResponse
    {
        return $this->errorResponse($message, null, 403);
    }

    /**
     * Not found response
     */
    protected function notFoundResponse(string $message = "Resource not found"): JsonResponse
    {
        return $this->errorResponse($message, null, 404);
    }

    /**
     * Validation error response
     */
    protected function validationErrorResponse($errors): JsonResponse
    {
        return $this->errorResponse("Validation failed", $errors, 422);
    }
}

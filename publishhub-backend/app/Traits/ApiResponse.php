<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Send a success response
     */
    public function successResponse($message = 'Success', $data = null, $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Send an error response
     */
    public function errorResponse($message = 'Error', $statusCode = 400, $data = null): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Send a validation error response
     */
    public function validationErrorResponse($errors, $message = 'Validation failed', $statusCode = 422): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $errors,
        ], $statusCode);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Supports multiple roles: role:admin OR role:admin,author
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $allowedRoles = [];
        foreach ($roles as $roleParam) {
            $allowedRoles = array_merge($allowedRoles, explode(',', $roleParam));
        }

        if (!in_array($request->user()->role, $allowedRoles)) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You do not have permission to access this resource.'
            ], 403);
        }

        return $next($request);
    }
}

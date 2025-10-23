<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    protected array $allowedProviders = ['google', 'github', 'facebook'];

    /**
     * Get redirect URL for the provider (SPA-friendly)
     *
     * @OA\Get(
     *     path="/api/oauth/{provider}/redirect",
     *     summary="Get provider redirect URL",
     *     tags={"Auth"},
     *     @OA\Parameter(name="provider", in="path", required=true, @OA\Schema(type="string", enum={"google","github","facebook"})),
     *     @OA\Response(response=200, description="OK",
     *         @OA\JsonContent(type="object", @OA\Property(property="url", type="string"))
     *     ),
     *     @OA\Response(response=400, description="Unsupported provider")
     * )
     */
    public function redirect(string $provider): JsonResponse
    {
        if (!in_array($provider, $this->allowedProviders, true)) {
            return response()->json(['message' => 'Unsupported provider'], 400);
        }

        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    /**
     * OAuth callback: create/login user then redirect to frontend with token
     *
     * @OA\Get(
     *     path="/api/oauth/{provider}/callback",
     *     summary="OAuth callback handler",
     *     tags={"Auth"},
     *     @OA\Parameter(name="provider", in="path", required=true, @OA\Schema(type="string", enum={"google","github","facebook"})),
     *     @OA\Response(response=302, description="Redirect to frontend with token")
     * )
     */
    public function callback(string $provider)
    {
        if (!in_array($provider, $this->allowedProviders, true)) {
            return response()->json(['message' => 'Unsupported provider'], 400);
        }

        $socialUser = Socialite::driver($provider)->stateless()->user();

        $attributesMap = [
            'google' => 'google_id',
            'github' => 'github_id',
            'facebook' => 'facebook_id',
        ];
        $providerColumn = $attributesMap[$provider];

        $user = User::where($providerColumn, $socialUser->getId())
            ->orWhere('email', $socialUser->getEmail())
            ->first();

        if (!$user) {
            $user = new User();
            $user->name = $socialUser->getName() ?: ($socialUser->getNickname() ?: 'User');
            $user->email = $socialUser->getEmail() ?: Str::lower($provider.'_'.$socialUser->getId().'@example.test');
            $user->password = Hash::make(Str::random(32));
        }

        $user->{$providerColumn} = $socialUser->getId();
        if (method_exists($socialUser, 'getAvatar')) {
            $user->provider_avatar = $socialUser->getAvatar();
        }
        $user->save();

        // Create Sanctum token
        $token = $user->createToken('oauth-'.$provider)->plainTextToken;

        $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
        $redirectUrl = $frontend.'/auth/callback?token='.urlencode($token).'&provider='.urlencode($provider);

        return redirect()->away($redirectUrl);
    }
}

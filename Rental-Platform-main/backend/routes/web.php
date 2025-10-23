<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $public = config('app-info.public_site_url');
    if ($public && app()->environment('production')) {
        return redirect()->away($public);
    }

    // Fallback in non-production or if no public URL configured
    return view('welcome');
});

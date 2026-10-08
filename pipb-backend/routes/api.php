<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminNewsController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductDocumentController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProductVoteController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::put(
        '/notifications/{id}/read',
        [NotificationController::class, 'markAsRead']
    );
});

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCTS
|--------------------------------------------------------------------------
*/

Route::get('/products', [ProductController::class, 'index']);

/*
|--------------------------------------------------------------------------
| MAHASISWA PRODUCTS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'mahasiswa'])->group(function () {
    Route::get(
        '/products/mine',
        [ProductController::class, 'myProducts']
    );

    Route::post(
        '/products',
        [ProductController::class, 'store']
    );

    Route::put(
        '/products/{id}',
        [ProductController::class, 'update']
    );

    Route::delete(
        '/products/{id}',
        [ProductController::class, 'destroy']
    );
});

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCT DETAIL
|--------------------------------------------------------------------------
*/

Route::get(
    '/products/{id}',
    [ProductController::class, 'show']
);

/*
|--------------------------------------------------------------------------
| PRODUCT IMAGES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'mahasiswa'])->group(function () {
    Route::get(
        '/products/{productId}/images',
        [ProductImageController::class, 'index']
    );

    Route::post(
        '/products/{productId}/images',
        [ProductImageController::class, 'store']
    );

    Route::delete(
        '/product-images/{id}',
        [ProductImageController::class, 'destroy']
    );
});

/*
|--------------------------------------------------------------------------
| PRODUCT DOCUMENTS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'mahasiswa'])->group(function () {
    Route::get(
        '/products/{productId}/documents',
        [ProductDocumentController::class, 'index']
    );

    Route::post(
        '/products/{productId}/documents',
        [ProductDocumentController::class, 'store']
    );

    Route::delete(
        '/product-documents/{id}',
        [ProductDocumentController::class, 'destroy']
    );
});

/*
|--------------------------------------------------------------------------
| PUBLIC CATEGORIES
|--------------------------------------------------------------------------
*/

Route::get(
    '/categories',
    [CategoryController::class, 'index']
);

/*
|--------------------------------------------------------------------------
| ADMIN - CATEGORIES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {
        Route::post(
            '/categories',
            [CategoryController::class, 'store']
        );

        Route::put(
            '/categories/{id}',
            [CategoryController::class, 'update']
        );

        Route::delete(
            '/categories/{id}',
            [CategoryController::class, 'destroy']
        );
    });

/*
|--------------------------------------------------------------------------
| PUBLIC NEWS
|--------------------------------------------------------------------------
*/

Route::get(
    '/news',
    [NewsController::class, 'index']
);

Route::get(
    '/news/{id}',
    [NewsController::class, 'show']
);

/*
|--------------------------------------------------------------------------
| CONTENT MANAGER - PRODUCTS
|--------------------------------------------------------------------------
|
| Flow:
|
| View Submitted Products
|        ↓
| Select Product
|        ↓
| Evaluate Product
|        ↓
| Assign Score / Rating
|        ↓
| Write Review / Feedback
|        ↓
| Publish Decision
|    ┌────┼───────────────┐
|    ↓    ↓               ↓
| Reject  Request         Approve
|         Revision          ↓
|    ↓      ↓           Published
| Rejected Needs
|          Revision
|
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'content_manager'])
    ->prefix('content-manager')
    ->group(function () {

        /*
        |------------------------------------------------------------------
        | View Submitted Products
        |------------------------------------------------------------------
        */

        Route::get(
            '/products',
            [AdminProductController::class, 'index']
        );

        /*
        |------------------------------------------------------------------
        | Evaluate Product
        | Assign Score / Rating
        | Write Review / Feedback
        |------------------------------------------------------------------
        */

        Route::post(
            '/products/{id}/evaluation',
            [ProductVoteController::class, 'store']
        );

        /*
        |------------------------------------------------------------------
        | Publish Decision - Approve
        |------------------------------------------------------------------
        */

        Route::put(
            '/products/{id}/approve',
            [AdminProductController::class, 'approve']
        );

        /*
        |------------------------------------------------------------------
        | Publish Decision - Request Revision
        |------------------------------------------------------------------
        */

        Route::put(
            '/products/{id}/request-revision',
            [AdminProductController::class, 'requestRevision']
        );

        /*
        |------------------------------------------------------------------
        | Publish Decision - Reject
        |------------------------------------------------------------------
        */

        Route::put(
            '/products/{id}/reject',
            [AdminProductController::class, 'reject']
        );

        /*
        |------------------------------------------------------------------
        | Investment
        |------------------------------------------------------------------
        */

        Route::put(
            '/products/{id}/investment',
            [AdminProductController::class, 'investment']
        );

        /*
        |------------------------------------------------------------------
        | Administrative Delete
        |------------------------------------------------------------------
        */

        Route::delete(
            '/products/{id}',
            [AdminProductController::class, 'destroy']
        );
    });

/*
|--------------------------------------------------------------------------
| CONTENT MANAGER - NEWS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'content_manager'])
    ->prefix('content-manager')
    ->group(function () {

        Route::get(
            '/news',
            [AdminNewsController::class, 'index']
        );

        Route::get(
            '/news/{id}',
            [AdminNewsController::class, 'show']
        );

        Route::post(
            '/news',
            [AdminNewsController::class, 'store']
        );

        Route::put(
            '/news/{id}',
            [AdminNewsController::class, 'update']
        );

        Route::delete(
            '/news/{id}',
            [AdminNewsController::class, 'destroy']
        );
    });

/*
|--------------------------------------------------------------------------
| ADMIN - USERS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get(
            '/users',
            [AdminUserController::class, 'index']
        );

        Route::get(
            '/users/{id}',
            [AdminUserController::class, 'show']
        );

        Route::post(
            '/users',
            [AdminUserController::class, 'store']
        );

        Route::put(
            '/users/{id}',
            [AdminUserController::class, 'update']
        );

        Route::delete(
            '/users/{id}',
            [AdminUserController::class, 'destroy']
        );
    });
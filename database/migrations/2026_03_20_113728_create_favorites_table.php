<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            // Foreign key for the user
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Foreign key for the product
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Prevent a user from favoriting the same product twice at the DB level
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

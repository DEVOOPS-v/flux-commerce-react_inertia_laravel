<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Dresses',
            'Shorts',
            'Sweatshirts',
            'Swimwear',
            'Jackets',
            'T-Shirts & Tops',
            'Jeans'
        ];

        $prefixes = [
            'Flux',
            'Aero',
            'Kinetic',
            'Vapor',
            'Apex',
            'Phantom',
            'Zenith'
        ];

        $types = [
            'Core Hoodie',
            'Tech Runner',
            'Utility Vest',
            'Element Jacket',
            'Impact Tee',
            'Grid Pants'
        ];

        $imageKeyword = $this->faker->randomElement([
            'fashion',
            'streetwear',
            'sneakers',
            'minimalist'
        ]);

        $allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        // Logic fix: Generate the name string once to ensure it matches the slug
        $productName = $this->faker->randomElement($prefixes) . ' ' .
            $this->faker->randomElement($types) . ' v.' .
            $this->faker->numberBetween(1, 9);

        // Required for the updated image URL signature
        $sig = $this->faker->unique()->numberBetween(1, 10000);

        return [
            'name' => $productName,

            // Slug is generated from the EXACT name variable above 
            // Unique suffix ensures no duplicate slug crashes during seeding
            'slug' => Str::slug($productName) . '-' . $this->faker->unique()->numberBetween(1, 10000),

            'description' => $this->faker->paragraph(),

            'price' => $this->faker->randomFloat(2, 899, 5999),

            'stock' => $this->faker->numberBetween(0, 100),

            'category_id' => \App\Models\Category::inRandomOrder()->first()->id ?? 1,

            // 'category' => $this->faker->randomElement($categories),

            'sizes' => $this->faker->randomElements($allSizes, rand(2, 4)),

            // Updated image URL for better reliability compared to source.unsplash
            'image' => "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80&sig={$sig}",

            'is_available' => $this->faker->boolean(95),

            'is_featured' => $this->faker->boolean(20),

            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'updated_at' => now(),
        ];
    }
}

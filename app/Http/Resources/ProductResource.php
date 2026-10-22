<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'description' => $this->description,

            'price' => $this->price,

            'category' => $this->category,

            'image' => $this->image,

            'image_url' => $this->image_url,

            'sizes' => $this->sizes ?? ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

            'is_available' => (bool) $this->is_available,

            'is_featured' => (bool) $this->is_featured,

            'in_stock' => $this->stock > 0, // ✅ optional helper for frontend
        ];
    }
}

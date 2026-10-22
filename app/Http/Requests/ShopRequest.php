<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:10',

            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',

            'sort' => 'nullable|string|in:price_asc,price_desc,latest,oldest',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'product_id' => $this->isMethod('post') ? ['required', 'exists:products,id'] : ['nullable'],
            'quantity'   => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
}

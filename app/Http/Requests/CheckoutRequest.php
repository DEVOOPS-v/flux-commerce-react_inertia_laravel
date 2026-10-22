<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'full_name'      => ['required', 'string', 'max:255'],
            'phone'          => ['required', 'string', 'regex:/^([0-9\s\-\+\(\)]*)$/', 'min:10'],
            'address'        => ['required', 'string', 'max:500'],
            'city'           => ['required', 'string', 'max:100'],
            'postal_code'    => ['required', 'string', 'max:10'],
            'payment_method' => ['required', 'in:cod,bank_transfer'], // ⚠️ matches migration
            'shipping'       => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'We need your name for the delivery record.',
            'phone.regex'        => 'Please enter a valid phone number.',
            'payment_method.in'  => 'Invalid payment method selected.',
        ];
    }
}

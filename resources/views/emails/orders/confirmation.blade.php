<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation #{{ $order->order_number }}</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Inter:wght@400;600&display=swap"
        rel="stylesheet" />
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            /* slate-50 */
            font-family: "Inter", sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        /* The "FLUX" Heading Style: Heavy, Tight, Uppercase */
        .flux-heading {
            font-family: "Plus Jakarta Sans", sans-serif;
            font-weight: 800;
            letter-spacing: -0.05em;
            text-transform: uppercase;
        }

        @media only screen and (max-width: 600px) {
            .content-padding {
                padding: 24px !important;
            }

            .mobile-full {
                width: 100% !important;
                display: block !important;
            }
        }
    </style>
</head>

<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc">
        <tr>
            <td align="center" style="padding: 40px 16px">
                <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
            ">
                    <tr>
                        <td align="center" bgcolor="#0f172a" style="padding: 60px 40px">
                            <p style="
                    color: #db2777;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    margin: 0 0 10px 0;
                  ">
                                Confirmed
                            </p>
                            <h1 class="flux-heading" style="
                    color: #ffffff;
                    font-size: 48px;
                    margin: 0;
                    line-height: 1;
                  ">
                                FLUX
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-padding" style="padding: 50px 50px 40px 50px; text-align: center">
                            <h2 class="flux-heading" style="color: #0f172a; font-size: 32px; margin: 0 0 16px 0">
                                Got your gear.
                            </h2>
                            <p style="
                    color: #64748b;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0;
                  ">
                                Hi {{ $order->ship_name }}, we’re processing your order now.
                                You’ll get another ping when it hits the road.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 50px">
                            <table width="100%" border="0" cellspacing="0" cellpadding="20" bgcolor="#f1f5f9"
                                style="border-radius: 16px">
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="
                              font-size: 11px;
                              font-weight: 800;
                              color: #94a3b8;
                              text-transform: uppercase;
                              letter-spacing: 0.1em;
                              padding-bottom: 4px;
                            ">
                                                    Order Number
                                                </td>
                                                <td align="right" style="
                              font-size: 11px;
                              font-weight: 800;
                              color: #94a3b8;
                              text-transform: uppercase;
                              letter-spacing: 0.1em;
                              padding-bottom: 4px;
                            ">
                                                    Status
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="
                              font-size: 16px;
                              font-weight: 700;
                              color: #0f172a;
                            ">
                                                    #{{ $order->order_number }}
                                                </td>
                                                <td align="right" style="
                              font-size: 14px;
                              font-weight: 700;
                              color: #db2777;
                            ">
                                                    PREPARING
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-padding" style="padding: 40px 50px">
                            <h3 class="flux-heading" style="
                    font-size: 14px;
                    color: #0f172a;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                  ">
                                The Directory
                            </h3>

                            @foreach ($order->items as $item)
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px">
                                <tr>
                                    <td width="60" valign="top">
                                        <div style="
                          background-color: #f8fafc;
                          border-radius: 8px;
                          width: 50px;
                          height: 50px;
                          line-height: 50px;
                          text-align: center;
                          color: #cbd5e1;
                          font-size: 10px;
                          border: 1px solid #e2e8f0;
                        ">
                                            IMG
                                        </div>
                                    </td>
                                    <td>
                                        <p style="
                          margin: 0;
                          font-size: 15px;
                          font-weight: 700;
                          color: #0f172a;
                        ">
                                            {{ $item->product->name }}
                                        </p>
                                        <p style="
                          margin: 4px 0 0 0;
                          font-size: 13px;
                          color: #64748b;
                        ">
                                            Qty: {{ $item->quantity }}
                                        </p>
                                    </td>
                                    <td align="right" valign="top">
                                        <p style="
                          margin: 0;
                          font-size: 15px;
                          font-weight: 700;
                          color: #0f172a;
                        ">
                                            ₱{{ number_format($item->price * $item->quantity, 2) }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            @endforeach

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="
                    border-top: 1px solid #f1f5f9;
                    padding-top: 20px;
                    margin-top: 10px;
                  ">
                                <tr>
                                    <td style="
                        padding-bottom: 10px;
                        color: #64748b;
                        font-size: 14px;
                      ">
                                        Shipping
                                    </td>
                                    <td align="right" style="
                        padding-bottom: 10px;
                        color: #10b981;
                        font-size: 14px;
                        font-weight: 700;
                      ">
                                        {{ $order->shipping_fee == 0 ? 'FREE' :
                                        '₱'.number_format($order->shipping_fee, 2) }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="flux-heading" style="font-size: 20px; color: #0f172a">
                                        Total
                                    </td>
                                    <td align="right" class="flux-heading" style="font-size: 24px; color: #db2777">
                                        ₱{{ number_format($order->total, 2) }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 0 50px 60px 50px">
                            <div style="
                    background-color: #f8fafc;
                    border: 1px dashed #cbd5e1;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: left;
                  ">
                                <p style="
                      font-size: 11px;
                      font-weight: 800;
                      color: #94a3b8;
                      text-transform: uppercase;
                      letter-spacing: 0.1em;
                      margin: 0 0 8px 0;
                    ">
                                    Shipping Address
                                </p>
                                <p style="
                      font-size: 14px;
                      color: #475569;
                      margin: 0;
                      line-height: 1.5;
                    ">
                                    <strong>{{ $order->ship_name }}</strong><br />
                                    {{ $order->ship_address }}, {{ $order->ship_city }}
                                </p>
                            </div>

                            <a href="{{ route('checkout.success', $order->id) }}" style="
                    display: inline-block;
                    background-color: #db2777;
                    color: #ffffff;
                    padding: 20px 40px;
                    border-radius: 100px;
                    text-decoration: none;
                    font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                    font-weight: 800;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    box-shadow: 0 10px 20px rgba(219, 39, 119, 0.2);
                  ">Track Your Drop</a>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" bgcolor="#f8fafc" style="padding: 40px; border-top: 1px solid #f1f5f9">
                            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 16px 0">
                                &copy; {{ date('Y') }} FLUX INC. 123 URBAN BLVD.
                            </p>
                            <div style="
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                  ">
                                <a href="#" style="
                      color: #0f172a;
                      text-decoration: none;
                      margin: 0 10px;
                    ">Shop</a>
                                <a href="#" style="
                      color: #0f172a;
                      text-decoration: none;
                      margin: 0 10px;
                    ">Support</a>
                                <a href="#" style="
                      color: #0f172a;
                      text-decoration: none;
                      margin: 0 10px;
                    ">Privacy</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
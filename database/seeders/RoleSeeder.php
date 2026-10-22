<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear Cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Permissions with guard_name
        $permissions = ['view products', 'create products', 'edit products', 'delete products', 'manage orders'];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // 3. Create Roles with guard_name
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole  = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // 4. Assign Permissions to Roles
        $adminRole->syncPermissions(Permission::all());
        $userRole->syncPermissions(['view products']);

        // 5. Create the SYSTEM ADMIN account
        $admin = User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]
        );
        $admin->assignRole($adminRole);

        // 6. Create the REGULAR USER account (FOR TESTING)
        $user = User::updateOrCreate(
            ['email' => 'customer@test.com'],
            [
                'name' => 'Regular Customer',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );
        $user->assignRole($userRole);
    }
}

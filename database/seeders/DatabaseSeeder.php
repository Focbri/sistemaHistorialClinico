<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->user();
        
    }

    public function user (){
        User::factory()->create([
            'name' => 'Joan',
            'email' => 'joanfpg2002@gmail.com',
            'password' => 'admin123',
        ]);
    }
}

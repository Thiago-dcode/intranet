<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Module;
use App\Models\Company;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        $user = User::firstOrCreate([
            'name' => 'arzuma',
            'email' => 'arzuma@arzuma.es',
            'password'=> 'arzuma@arzuma.es'
        ]);
      $beraTextil =   Company::firstOrCreate([
            'name' => 'bera-textil',
            'color' => '#0082CA',
            
        ]);
        $carnicasPozas =   Company::firstOrCreate([
            'name' => 'carnicaspozas',
            'color' => '#739640',
            
        ]);
      $moduleClientes =  Module::firstOrCreate([
            'name' => 'clientes',
            'route'=>'/clientes'
        ]);
      $moduleProductos =   Module::firstOrCreate([
            'name' => 'productos',
            'route'=>'/productos'
        ]);
       $moduleGraficos = Module::firstOrCreate([
            'name' => 'graficos',
            'route'=>'/graficos'
        ]);

        //seeding pivot tables


        $user->companies()->attach([$beraTextil->id,$carnicasPozas->id]);
        $user->modules()->attach([ $moduleClientes->id, $moduleProductos->id, $moduleGraficos->id]);
        $beraTextil->modules()->attach([ $moduleClientes->id, $moduleProductos->id, $moduleGraficos->id]);
        $carnicasPozas->modules()->attach([ $moduleClientes->id, $moduleProductos->id]);
    }
}

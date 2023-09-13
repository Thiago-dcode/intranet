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
       

        $userArzuma = User::firstOrCreate([
            'name' => 'arzuma',
            'email' => 'arzuma@arzuma.es',
            'password'=> 'arzuma@arzuma.es'
        ]);
        $userExample = User::firstOrCreate([
            'name' => 'example',
            'email' => 'example@example.es',
            'password'=> 'example@example.es'
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
            'route'=>'/clientes',
            'logo' => 'user'
        ]);
      $moduleArticulos =   Module::firstOrCreate([
            'name' => 'articulos',
            'route'=>'/articulos',
            'logo'=> "cart-shopping"

        ]);
       $moduleGraficos = Module::firstOrCreate([
            'name' => 'graficos',
            'route'=>'/graficos',
            'logo' => 'chart-pie'
        ]);

        //seeding pivot tables


        $userArzuma->companies()->attach([$beraTextil->id,$carnicasPozas->id]);
        $userArzuma->modules()->attach([ $moduleClientes->id, $moduleArticulos->id, $moduleGraficos->id]);
        $beraTextil->modules()->attach([ $moduleClientes->id, $moduleArticulos->id, $moduleGraficos->id]);
        $carnicasPozas->modules()->attach([ $moduleClientes->id, $moduleArticulos->id]);
        $userExample->companies()->attach([$carnicasPozas->id]);

    }
}

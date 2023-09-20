<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Module;
use App\Models\Company;

use App\Models\ModuleUser;
use App\Intranet\ModuleBuilder;
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
            'password' => 'arzuma@arzuma.es'
        ]);
        $userExample = User::firstOrCreate([
            'name' => 'example',
            'email' => 'example@example.es',
            'password' => 'example@example.es'
        ]);
        $beraTextil =   Company::firstOrCreate([
            'name' => 'bera-textil',
            'color' => '#0082CA',
            'logo' => env('PUBLIC_STORAGE'). '/companyLogo'.'/bera-textil.png'

        ]);
        $carnicasPozas =   Company::firstOrCreate([
            'name' => 'carnicaspozas',
            'color' => '#739640',
            'logo' =>  env('PUBLIC_STORAGE'). '/companyLogo'.'/carnicaspozas.png'

        ]);
        $moduleClientes =  Module::firstOrCreate([
            'name' => 'clientes',
            'route' => 'clientes',
            'logo' => 'User'
        ]);
        $moduleEans =  Module::firstOrCreate([
            'name' => 'eans',
            'route' => 'articulos/eans',
            'logo' => 'Barcode'
        ]);
        $moduleArticulos =   Module::firstOrCreate([
            'name' => 'articulos',
            'route' => 'articulos',
            'logo' => "CartShopping"

        ]);
        $moduleGraficos = Module::firstOrCreate([
            'name' => 'graficos',
            'route' => 'graficos',
            'logo' => 'ChartPie'
        ]);
        $moduleEmail = Module::firstOrCreate([
            'name' => 'email',
            'route' => 'email',
            'logo' => 'Envelope'
        ]);

        $userArzuma->companies()->attach([$beraTextil->id, $carnicasPozas->id]);
        $beraTextil->modules()->attach([$moduleClientes->id, $moduleArticulos->id, $moduleGraficos->id, $moduleEans->id]);
        $carnicasPozas->modules()->attach([$moduleClientes->id, $moduleArticulos->id,$moduleEmail->id]);
        $userExample->companies()->attach([$carnicasPozas->id]);

        //Assign modules to user.
        //IMPORTANT! before assign a module to a user, a company already must have that module
        //IMPORTANT! A module cannot be assigned twice to a user. Example if the user already has the module articulos in
        // the company bera-textil, that module cannot be assigned again to the same company.

        ModuleUser::firstOrCreate([

            'user_id' => $userArzuma->id,
            'company' => $beraTextil->name,
            'module_id' => $moduleArticulos->id
        ]);

        ModuleUser::firstOrCreate([

            'user_id' => $userArzuma->id,
            'company' => $beraTextil->name,
            'module_id' => $moduleEans->id
        ]);

        ModuleUser::firstOrCreate([

            'user_id' => $userArzuma->id,
            'company' => $beraTextil->name,
            'module_id' => $moduleGraficos->id
        ]);

        ModuleUser::firstOrCreate([

            'user_id' => $userArzuma->id,
            'company' => $carnicasPozas->name,
            'module_id' => $moduleArticulos->id
        ]);
        ModuleUser::firstOrCreate([

            'user_id' => $userExample->id, 
            'company' => $carnicasPozas->name,
            'module_id' => $moduleEmail->id
        ]); 
        ModuleUser::firstOrCreate([

            'user_id' => $userExample->id,
            'company' => $carnicasPozas->name,
            'module_id' => $moduleGraficos->id
        ]);
        

       

        $modules = Module::all();
        ModuleBuilder::generateRoutes($modules);
        foreach ($modules as $key => $module) {
           ModuleBuilder::generateView($module);
        }
    }
}

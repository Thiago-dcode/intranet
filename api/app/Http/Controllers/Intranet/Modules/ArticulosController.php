<?php


       namespace App\Http\Controllers\Intranet\Modules;

       
       use Illuminate\Http\Request;

       use App\Traits\HttpResponses;

       use App\Http\Controllers\Controller;

       
       class ArticulosController extends Controller

       {

            
               use HttpResponses;

               

               public function index(){

       

                return response('Articulos module created successfully.');
                //start your logic here
               }
                
         
               

       }
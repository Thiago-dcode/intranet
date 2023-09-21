<?php


       namespace App\Http\Controllers\Intranet\Modules;

       
       use Illuminate\Http\Request;

       use App\Traits\HttpResponses;

       use App\Http\Controllers\Controller;

       
       class EmailController extends Controller

       {

            
               use HttpResponses;

               

               public function index(){

       

                return response('Email module created successfully.');
                //start your logic here
       
               }

       }
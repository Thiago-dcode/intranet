<?php
  namespace App\Http\Controllers\Intranet\Modules;

  use App\Models\Modules\Chart;
       use Illuminate\Support\Facades\DB;
       use Illuminate\Http\Request;

       use App\Traits\HttpResponses;

       use App\Http\Controllers\Controller;

       
       class GraficosController extends Controller

       {

            
               use HttpResponses;

               

               public function index(Request $request){

                
                if(!$request->user()->company_active){

                        return $this->error([],'User must has a company activated',401);
                }
                
               $userChartsByCompany =  DB::table('charts')->where('user_id',$request->user()->id)->where('company_name',$request->user()->company_active)->get();
              return $this->success($request->user()->charts);
                //start your logic here
       
               }
               public function types(Request $request){


                return $this->success(DB::table('chart_types')->get());

               }
               public function create(Request $request){

                        $errors = [];
                $fields = $request->validate([

                        'sql'=> 'required',
                        'type'=> 'required',
                       ]);

                        //Handle sql error

                       if(!DB::table('chart_types')->where('type',  $fields['type'])->exists()){

                                array_push($errors,'The chart type must be a available chart type');
                       };

                       if(!$errors)
                      {
                        
                        $user = $request->user();

                      $newChart =  Chart::create([
                        'sql' => $fields['sql'],
                        'type'=> $fields['type'],
                        'user_id'=> $user->id,
                        'company_name'=> $user->company_active
                       ]);
                       return $this->success($newChart,'Chart create successfully');
                }

                return $this->error($errors,'',422);
                


               }
               public function update($id,Request $request){
                        

                                $errors = [];
                               $fields = $request->validate([

                                'sql'=> 'required',
                                'type'=> 'required',
                        ]);

                //Handle sql error
                        
               if(!DB::table('chart_types')->where('type',  $fields['type'])->exists()){

                        array_push($errors,'The chart type must be a available chart type');
               };

               if(!$errors)
              {
                
                $chart = Chart::find($id);

              $chartUpdated =  $chart->update([
                'sql' => $fields['sql'],
                'type'=> $fields['type'],
              ]);
               return $this->success($chart,'Chart updated successfully');
        }

        return $this->error($errors,'',422);
        


       }
               public function delete($id){

                       $chart = Chart::find($id);

                       if(!$chart){

                       return  $this->error([],"Trying to delete a chart that don't exist",422);
                       }

                       $chart->delete();

                       return $this->success([],'Chart deleted successfully');

               }

       }
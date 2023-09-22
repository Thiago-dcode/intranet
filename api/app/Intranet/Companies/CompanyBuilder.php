<?php

namespace App\Intranet\Modules;
use App\Intranet\Utils\Path;
use App\Intranet\Utils\Utils;


class CompanyBuilder
{


        public function generateHostEnvVar($company,$host){

            $company = Utils::objectToArray($company);
            $companyNameEnv = strtoupper(str_replace('-', '_', $company['name']));
            $envKey = 'DBHOST_' . $companyNameEnv . '_PYME';
            Utils::createEnvVar($envKey, $host);

        }

}
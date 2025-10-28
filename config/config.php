<?php
Class Conexion{

    static public function conectar(){

        date_default_timezone_set('America/Mexico_City');
        $link = new PDO("mysql:host=".$_ENV["DB_HOST"].";dbname=".$_ENV["DB_BASE"],$_ENV["DB_USER"], $_ENV["DB_PWD"]);
        $link->exec("set names utf8");
        return $link;
    }

}
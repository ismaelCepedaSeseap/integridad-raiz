<?php
    class Auth{
        private $dbConexion;
        private $sesion = "SECURE_AUTH_SESSION";
        

        public function __construct($dbConexion = null){
            $this->dbConexion = $dbConexion;
            $this->setSafeSession();
        }

        private function setSafeSession(){
            if(session_status() === PHP_SESSION_NONE){
                session_set_cookie_params([
                    'lifetime' => 0,
                    'path' => '/',
                    'domain' => '',
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);

                session_name($this->sesion);
                session_start();
            }
        }

        public function login($email, $password){
            $stmt = $this->dbConexion->prepare("SELECT id, pass, correo FROM usuarios where correo = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if($user && password_verify($password, $user['pass'])){
                session_regenerate_id(true);
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
                $_SESSION['last_ip'] = $_SERVER['REMOTE_ADDR'];
                

                return true;
            }
            return false;
        }

        public function isLoggedIn(){
            if(!isset($_SESSION['user_id'])) return false;

            if($_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT'] || $_SESSION['last_ip'] !== $_SERVER['REMOTE_ADDR']){
                $this->logout();
                return false;
            }
            return true;
        }

        public function logout(){
            session_unset();
            session_destroy();
            setcookie($this->sesion, '', time() - 3600, '/');
        }
    }
?>
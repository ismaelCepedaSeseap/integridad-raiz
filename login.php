<?php
    $actual = basename(__FILE__);
    include_once "assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - Integridad desde la Raíz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Quicksand', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            width: 100%;
            max-width: 450px;
            overflow: hidden;
        }

        .input-group {
            position: relative;
            margin-bottom: 1.25rem;
        }

        .input-field {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border-radius: 20px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            outline: none;
        }

        .input-field:focus {
            border-color: #16a34a;
            background: white;
            box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
        }

        .captcha-container {
            background: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 20px;
            padding: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }

        #captchaCanvas {
            background: #fff;
            border-radius: 12px;
            cursor: pointer;
            border: 1px solid #e2e8f0;
        }

        .btn-primary {
            background: #16a34a;
            color: white;
            padding: 1rem;
            border-radius: 20px;
            font-weight: 700;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
        }

        .btn-primary:hover {
            background: #15803d;
            transform: translateY(-2px);
        }

        .bg-decoration {
            position: fixed;
            z-index: -1;
            border-radius: 50%;
            filter: blur(80px);
        }

        /* Shake animation for error */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
    </style>
</head>
<body>

    <div class="bg-decoration bg-green-200 w-96 h-96 -top-20 -left-20 opacity-50"></div>
    <div class="bg-decoration bg-yellow-100 w-80 h-80 -bottom-20 -right-20 opacity-50"></div>

    <div class="login-card p-8 md:p-12" id="card">
        <div class="text-center mb-10">
            <div class="inline-block p-1 rounded-full border-4 border-green-500/20 mb-4">
                <img src="assets/images/logo.png" alt="Logo SEA" class="w-20 h-20 rounded-full shadow-inner" onerror="this.src='https://via.placeholder.com/80?text=SEA'">
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Acceso al Sistema</h1>
            <p class="text-slate-500 text-sm mt-2 font-medium italic">"Sembrando honestidad, cosechamos integridad"</p>
        </div>

        <form id="loginForm">
            <div class="input-group">
                <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                <input type="email" name="email" id="email" placeholder="Correo electrónico" class="input-field text-slate-700" required>
            </div>

            <div class="input-group">
                <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                <input type="password" name="password" id="password" placeholder="Contraseña" class="input-field text-slate-700" required>
                <button type="button" onclick="togglePassword()" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <i data-lucide="eye" id="eyeIcon" class="w-5 h-5"></i>
                </button>
            </div>

            <div class="px-2 mb-2 flex justify-between items-end">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validación Humana</span>
                <span id="captchaError" class="text-[10px] font-bold text-red-500 hidden uppercase tracking-widest">Código Incorrecto</span>
            </div>
            
            <div class="captcha-container">
                <div class="flex items-center gap-2">
                    <div class="relative group">
                        <!-- Canvas para generar el captcha visualmente en JS -->
                        <canvas id="captchaCanvas" width="120" height="40" onclick="generateCaptcha()"></canvas>
                        <div class="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                    </div>
                    <button type="button" onclick="generateCaptcha()" class="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                    </button>
                </div>
                <input type="text" id="captchaInput" placeholder="Código" class="w-24 p-2 text-center rounded-xl border-2 border-slate-200 focus:border-green-500 outline-none text-sm font-bold text-slate-700 uppercase" required autocomplete="off">
            </div>

            <button type="submit" class="btn-primary flex items-center justify-center gap-2">
                <span>Ingresar</span>
                <i data-lucide="arrow-right" class="w-5 h-5"></i>
            </button>
        </form>

        <div class="mt-8 pt-8 border-t border-slate-100 flex justify-center gap-4 grayscale opacity-40">
            <img src="assets/images/logo_puebla.png" alt="Puebla" class="h-6" onerror="this.style.display='none'">
            <img src="assets/images/logo_hidalgo.jpeg" alt="Hidalgo" class="h-6" onerror="this.style.display='none'">
            <img src="assets/images/logo_tlaxcala.png" alt="Tlaxcala" class="h-6" onerror="this.style.display='none'">
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/generales/captcha.js"></script>
    <script src="assets/js/pages/login.js"></script>
    
    <script>
        
    </script>
</body>
</html>
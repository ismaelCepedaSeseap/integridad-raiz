if (typeof lucide !== 'undefined') lucide.createIcons();

        let currentCaptcha = "";

        // Generar Captcha en el Frontend
        function generateCaptcha() {
            const canvas = document.getElementById('captchaCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            currentCaptcha = "";
            
            // Limpiar
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Fondo con ruido
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Líneas de ruido
            for(let i=0; i<6; i++) {
                ctx.strokeStyle = `rgba(22, 163, 74, ${Math.random() * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }

            // Texto del código
            ctx.font = "bold 22px Quicksand";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            for(let i=0; i<5; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                currentCaptcha += char;
                
                ctx.save();
                ctx.translate(20 + i * 20, 20 + (Math.random() - 0.5) * 10);
                ctx.rotate((Math.random() - 0.5) * 0.4);
                ctx.fillStyle = "#16a34a";
                ctx.fillText(char, 0, 0);
                ctx.restore();
            }
        }

        // Manejar el envío del formulario
        /*function handleFormSubmit(e) {
            alert("hola");
            const userInput = document.getElementById('captchaInput').value.toUpperCase();
            const errorMsg = document.getElementById('captchaError');
            const card = document.getElementById('card');

            if (userInput !== currentCaptcha) {
                e.preventDefault(); // BLOQUEA el envío al servidor PHP
                
                // Feedback visual de error
                errorMsg.classList.remove('hidden');
                card.classList.add('animate-shake');
                document.getElementById('captchaInput').classList.add('border-red-500');
                
                setTimeout(() => {
                    card.classList.remove('animate-shake');
                }, 300);

                generateCaptcha(); // Regenerar para el próximo intento
                document.getElementById('captchaInput').value = "";
                return false;
            }

            // Si llegamos aquí, el captcha es correcto y se envía el POST
            return true;
        }*/

        function togglePassword() {
            const pwdInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            const isPwd = pwdInput.type === 'password';
            pwdInput.type = isPwd ? 'text' : 'password';
            eyeIcon.setAttribute('data-lucide', isPwd ? 'eye-off' : 'eye');
            lucide.createIcons();
        }

        // Inicializar el primer captcha al cargar
        window.addEventListener('load', generateCaptcha);

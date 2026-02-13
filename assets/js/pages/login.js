var form = document.getElementById("loginForm");

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    var autorizado = await verificarUsuario();

    if(!autorizado.success){
        Swal.fire("Error", "Usuario y/o contraseña incorrectos.", "error");
        generateCaptcha();
    }
    else{
        window.location.href = "admin/dashboard.php";
    }
});

async function verificarUsuario() {
    try {
        var formData = new FormData();
        formData.append("email",document.getElementById("email").value);
        formData.append("password",document.getElementById("password").value);
        const respuesta = await fetch("assets/php/login/verificarLogin.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        });
        return await respuesta.json();
    }
    catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor de validación.", "error");
    }
}

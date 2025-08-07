// HU0002 - Formulario de Login - JavaScript
// Script educativo para manejo del formulario de login

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Obtener referencias a los elementos del formulario
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const loginButton = document.getElementById("loginButton");
  const statusMessage = document.getElementById("statusMessage");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  // Configuración de usuarios válidos (solo para propósitos educativos)
  const validUsers = [
    { username: "admin", password: "admin123" },
    { username: "estudiante", password: "estudiante123" },
    { username: "profesor", password: "profesor123" },
  ];

  // Función para mostrar/ocultar contraseña
  togglePasswordBtn.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Cambiar el ícono
    const icon = this.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  // Validación en tiempo real para el campo de usuario
  usernameInput.addEventListener("input", function () {
    validateUsername();
  });

  // Validación en tiempo real para el campo de contraseña
  passwordInput.addEventListener("input", function () {
    validatePassword();
  });

  // Función para validar el campo de usuario
  function validateUsername() {
    const username = usernameInput.value.trim();
    const errorElement = document.getElementById("usernameError");

    if (username.length === 0) {
      showFieldError(errorElement, "");
      return false;
    }

    if (username.length < 3) {
      showFieldError(
        errorElement,
        "El usuario debe tener al menos 3 caracteres"
      );
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showFieldError(
        errorElement,
        "Solo se permiten letras, números y guiones bajos"
      );
      return false;
    }

    showFieldError(errorElement, "");
    return true;
  }

  // Función para validar el campo de contraseña
  function validatePassword() {
    const password = passwordInput.value;
    const errorElement = document.getElementById("passwordError");

    if (password.length === 0) {
      showFieldError(errorElement, "");
      return false;
    }

    if (password.length < 6) {
      showFieldError(
        errorElement,
        "La contraseña debe tener al menos 6 caracteres"
      );
      return false;
    }

    showFieldError(errorElement, "");
    return true;
  }

  // Función para mostrar errores en los campos
  function showFieldError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = message ? "block" : "none";
  }

  // Función para mostrar mensajes de estado
  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = "block";

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 5000);
  }

  // Función para mostrar el estado de carga
  function setLoadingState(isLoading) {
    if (isLoading) {
      loginButton.classList.add("loading");
      loginButton.disabled = true;
    } else {
      loginButton.classList.remove("loading");
      loginButton.disabled = false;
    }
  }

  // Función para validar credenciales (simulación)
  function validateCredentials(username, password) {
    return validUsers.some(
      (user) => user.username === username && user.password === password
    );
  }

  // Función para simular el proceso de login
  function simulateLogin(username, password) {
    return new Promise((resolve, reject) => {
      // Simular delay de red (1-2 segundos)
      const delay = Math.random() * 1000 + 1000;

      setTimeout(() => {
        if (validateCredentials(username, password)) {
          resolve({
            success: true,
            message: "Login exitoso",
            user: { username: username },
          });
        } else {
          reject({
            success: false,
            message: "Usuario o contraseña incorrectos",
          });
        }
      }, delay);
    });
  }

  // Función para manejar el login exitoso
  function handleSuccessfulLogin(username) {
    // Guardar información de sesión si "Recordarme" está marcado
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUser", username);
      localStorage.setItem("loginTime", new Date().toISOString());
    }

    showStatusMessage("¡Login exitoso! Redirigiendo...", "success");

    // Simular redirección después de 2 segundos
    setTimeout(() => {
      // En una aplicación real, aquí se redirigiría a la página principal
      console.log("Redirigiendo al dashboard...");
      alert(
        `¡Bienvenido ${username}! En una aplicación real serías redirigido al dashboard.`
      );
    }, 2000);
  }

  // Función para manejar errores de login
  function handleLoginError(error) {
    showStatusMessage(error.message, "error");

    // Limpiar el campo de contraseña por seguridad
    passwordInput.value = "";
    passwordInput.focus();
  }

  // Manejador del envío del formulario
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener valores de los campos
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validar campos antes del envío
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) {
      showStatusMessage(
        "Por favor, corrige los errores en el formulario",
        "error"
      );
      return;
    }

    // Mostrar estado de carga
    setLoadingState(true);

    try {
      // Intentar hacer login
      const result = await simulateLogin(username, password);

      // Login exitoso
      handleSuccessfulLogin(username);
    } catch (error) {
      // Error en el login
      handleLoginError(error);
    } finally {
      // Quitar estado de carga
      setLoadingState(false);
    }
  });

  // Cargar usuario recordado al cargar la página
  function loadRememberedUser() {
    const rememberedUser = localStorage.getItem("rememberedUser");
    const loginTime = localStorage.getItem("loginTime");

    if (rememberedUser && loginTime) {
      // Verificar si han pasado más de 7 días
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (new Date(loginTime) > sevenDaysAgo) {
        usernameInput.value = rememberedUser;
        rememberMeCheckbox.checked = true;
      } else {
        // Limpiar datos expirados
        localStorage.removeItem("rememberedUser");
        localStorage.removeItem("loginTime");
      }
    }
  }

  // Cargar usuario recordado al inicializar
  loadRememberedUser();

  // Función para mostrar información de usuarios de prueba
  function showTestUsers() {
    console.log("=== USUARIOS DE PRUEBA ===");
    validUsers.forEach((user) => {
      console.log(`Usuario: ${user.username} | Contraseña: ${user.password}`);
    });
    console.log("========================");
  }

  // Mostrar usuarios de prueba en la consola (solo para desarrollo)
  showTestUsers();

  // Agregar información de ayuda minimalista
  const helpInfo = document.createElement("div");
  helpInfo.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(26, 26, 26, 0.9);
        backdrop-filter: blur(20px);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-size: 12px;
        max-width: 280px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        font-family: 'Inter', sans-serif;
        line-height: 1.4;
    `;
  helpInfo.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px;"></div>
            <strong style="font-weight: 600;">Usuarios de prueba</strong>
        </div>
        <div style="font-family: 'SF Mono', Monaco, monospace; font-size: 11px; opacity: 0.9;">
            admin / admin123<br>
            estudiante / estudiante123<br>
            profesor / profesor123
        </div>
    `;
  document.body.appendChild(helpInfo);

  // Ocultar la ayuda después de 12 segundos
  setTimeout(() => {
    helpInfo.style.opacity = "0";
    helpInfo.style.transform = "translateY(10px)";
    helpInfo.style.transition = "all 0.3s ease";
    setTimeout(() => {
      helpInfo.style.display = "none";
    }, 300);
  }, 12000);

  // Agregar efectos de interacción suaves
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "translateY(-1px)";
      this.parentElement.style.transition = "transform 0.2s ease";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "translateY(0)";
    });
  });
});

// Función para limpiar datos de sesión (útil para desarrollo)
function clearSessionData() {
  localStorage.removeItem("rememberedUser");
  localStorage.removeItem("loginTime");
  console.log("Datos de sesión limpiados");
}

// Hacer la función disponible globalmente para debugging
window.clearSessionData = clearSessionData;

// ============================================
// PANTALLA DE CARGA
// ============================================
window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const heroImage = document.querySelector(".hero-image");

    // Ocultar pantalla de carga después de 1.5 segundos
    setTimeout(() => {
        loadingScreen.classList.add("hidden");

        // Activar animación del hero image después de que se oculte la carga
        setTimeout(() => {
            if (heroImage) {
                heroImage.classList.add("animate-in");
            }
        }, 300);
    }, 1500);
});

// Función para cambiar de página
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Setup scroll spy for category pages
    if (["diseno-producto", "ilustracion", "diseno-experiencia"].includes(pageId)) {
        setTimeout(() => {
            setupScrollSpy(pageId);
            // Activar el primer número por defecto
            const firstLink = targetPage.querySelector(".project-pagination a");
            if (firstLink) {
                targetPage.querySelectorAll(".project-pagination a").forEach((l) => l.classList.remove("active"));
                firstLink.classList.add("active");
            }
        }, 100);
    }

    // Animar barras de skills cuando se muestra "Sobre mí"
    if (pageId === "sobre-mi") {
        setTimeout(() => {
            animateSkillBars();
        }, 300);
    }

    // Reset filtro a "TODOS" cuando se muestra proyectos
    if (pageId === "proyectos") {
        const todosBtn = document.querySelector('.filter-btn[data-filter="todos"]');
        if (todosBtn) {
            filterProjects("todos");
            document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
            todosBtn.classList.add("active");
        }
    }
}

// Función para ir a la sección archivo
function scrollToArchive() {
    showPage("archivos");
    setTimeout(() => {
        const archiveSection = document.getElementById("archive-section");
        if (archiveSection) {
            archiveSection.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
}

// Función para ir a un proyecto específico desde el grid
function goToProject(pageId, projectId) {
    showPage(pageId);
    setTimeout(() => {
        const project = document.getElementById(projectId);
        if (project) {
            const offset = 200;
            const elementPosition = project.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }, 150);
}

// Setup scroll spy para actualizar los números de paginación
function setupScrollSpy(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    const projects = page.querySelectorAll(".project-wrapper");
    const paginationLinks = page.querySelectorAll(".project-pagination a");

    // Desconectar observadores anteriores si existen
    if (window.currentObservers) {
        window.currentObservers.forEach((obs) => obs.disconnect());
    }
    window.currentObservers = [];

    // Función para actualizar el link activo basado en scroll position
    function updateActiveLink() {
        let activeProject = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight * 0.35; // 35% desde arriba

        projects.forEach((project) => {
            const rect = project.getBoundingClientRect();
            const projectCenter = rect.top + rect.height / 4;
            const distance = Math.abs(projectCenter - viewportCenter);

            // Solo considerar proyectos que estén en la mitad superior de la pantalla
            if (rect.top < window.innerHeight * 0.6 && rect.bottom > 100 && distance < minDistance) {
                minDistance = distance;
                activeProject = project;
            }
        });

        if (activeProject) {
            const projectId = activeProject.id;
            paginationLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#" + projectId) {
                    link.classList.add("active");
                }
            });
        }
    }

    // Usar scroll event para mayor precisión
    const scrollHandler = () => {
        requestAnimationFrame(updateActiveLink);
    };

    // Remover handler anterior si existe
    if (window.currentScrollHandler) {
        window.removeEventListener("scroll", window.currentScrollHandler);
    }

    window.addEventListener("scroll", scrollHandler);
    window.currentScrollHandler = scrollHandler;

    // Ejecutar inmediatamente
    updateActiveLink();
}

// Animación de las barras de progreso con porcentajes
function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
        const targetWidth = bar.getAttribute("data-width");
        bar.style.width = "0%";
        setTimeout(() => {
            bar.style.width = targetWidth + "%";
        }, 100);
    });
}

// ============================================
// FILTROS DE PROYECTOS
// ============================================
function filterProjects(category) {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        if (category === "todos") {
            card.classList.remove("hidden");
        } else {
            const cardCategory = card.getAttribute("data-category");
            if (cardCategory === category) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        }
    });
}

// Event listeners para botones de filtro
document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");

        // Actualizar estado activo de botones
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // Filtrar proyectos
        filterProjects(filter);
    });
});

// Smooth scroll para los enlaces de paginación
document.querySelectorAll(".project-pagination a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = 200;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            // Actualizar estado activo inmediatamente
            const parentPage = this.closest(".page");
            if (parentPage) {
                parentPage.querySelectorAll(".project-pagination a").forEach((l) => l.classList.remove("active"));
                this.classList.add("active");
            }
        }
    });
});

// ============================================
// CURSOR PERSONALIZADO - INICIO
// ============================================
const cursor = document.getElementById("custom-cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

// Efecto hover en elementos clickeables
const clickables = document.querySelectorAll(
    "a, button, .archive-item, .project-card, .nav-logo, .interest-tag, .filter-btn, .category-nav-btn"
);

clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
    });
});

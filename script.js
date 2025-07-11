const products = [
  {
    modelo: "angel",
    tipo: "polo",
    tallas: ["S", "M", "L", "XL"],
    imagenDelantera: "polos marca/polo 1.2.png",
    imagenTrasera: "polos marca/polo 1.1.png",
    descripcion: "Polo de algodón premium con diseño moderno",
    descripcionCompleta: "Polo premium de algodón 100%.",
    caracteristicas: [
      "Material: 100% Algodón Premium",
      "Cuello redondo reforzado",
      "Costuras dobles para mayor durabilidad",
      "Colores que no se destiñen"
    ],
    precio: "s/ 30",
    cuidados: "Lavar en agua fría, secar a la sombra, planchar a temperatura media"
  },
  {
    modelo: "P002",
    tipo: "polera",
    tallas: ["M", "L", "XL"],
    imagen: "img/polera1.jpg"
  },
  {
    modelo: "P003",
    tipo: "polo",
    tallas: ["S", "M"],
    imagen: "img/polo2.jpg"
  },
  {
    modelo: "P004",
    tipo: "polera",
    tallas: ["L", "XL"],
    imagen: "img/polera2.jpg"
  }
];

const container = document.getElementById("product-container");
const filterType = document.getElementById("filter-type");
const filterSize = document.getElementById("filter-size");

function renderProducts() {
  container.innerHTML = "";

  const typeValue = filterType.value;
  const sizeValue = filterSize.value;

  const filtered = products.filter(product => {
    const matchesType = (typeValue === "all") || (product.tipo === typeValue);
    const matchesSize = (sizeValue === "all") || (product.tallas.includes(sizeValue));
    return matchesType && matchesSize;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No hay productos que coincidan con los filtros.</p>";
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Producto especial angel con dos imágenes
    if (product.modelo === "angel") {
      card.innerHTML = `
        <div class="image-container">
          <img src="${product.imagenDelantera}" alt="${product.modelo} - Delantera" class="product-image active">
          <img src="${product.imagenTrasera}" alt="${product.modelo} - Trasera" class="product-image">
          <div class="image-indicator">
            <span class="dot active" data-image="0"></span>
            <span class="dot" data-image="1"></span>
          </div>
        </div>
        <h3>${product.modelo}</h3>
        <p>Tipo: ${product.tipo.charAt(0).toUpperCase() + product.tipo.slice(1)}</p>
        <p>Tallas: ${product.tallas.join(", ")}</p>
        <p class="description">${product.descripcion}</p>
        <p class="price">${product.precio}</p>
        <p class="click-info">🔍 Click para ver más detalles</p>
      `;
      
      // Agregar funcionalidad de transición
      setupImageTransition(card);
      
      // Agregar evento de click para abrir modal
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Evitar que el click en los dots active el modal
        if (!e.target.classList.contains('dot')) {
          openProductModal(product);
        }
      });
    } else {
      // Productos normales
      card.innerHTML = `
        <img src="${product.imagen}" alt="${product.modelo}">
        <h3>${product.modelo}</h3>
        <p>Tipo: ${product.tipo.charAt(0).toUpperCase() + product.tipo.slice(1)}</p>
        <p>Tallas: ${product.tallas.join(", ")}</p>
      `;
    }

    container.appendChild(card);
  });
}

function setupImageTransition(card) {
  const images = card.querySelectorAll('.product-image');
  const dots = card.querySelectorAll('.dot');
  const container = card.querySelector('.image-container');
  let currentIndex = 0;
  let autoTransitionInterval;

  // Función para cambiar imagen
  function changeImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  // Auto-transición cada 3 segundos
  function startAutoTransition() {
    autoTransitionInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      changeImage(nextIndex);
    }, 3000);
  }

  function stopAutoTransition() {
    clearInterval(autoTransitionInterval);
  }

  // Event listeners para los puntos indicadores
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      changeImage(index);
      stopAutoTransition();
      startAutoTransition();
    });
  });

  // Pausar auto-transición al hacer hover
  container.addEventListener('mouseenter', stopAutoTransition);
  container.addEventListener('mouseleave', startAutoTransition);

  // Iniciar auto-transición
  startAutoTransition();
}

// Función para abrir el modal con información completa del producto
function openProductModal(product) {
  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="modal-header">
        <h2>${product.modelo.toUpperCase()}</h2>
        <p class="modal-price">${product.precio}</p>
      </div>
      <div class="modal-body">
        <div class="modal-images">
          <div class="modal-image-container">
            <img src="${product.imagenDelantera}" alt="${product.modelo} - Delantera" class="modal-image active">
            <img src="${product.imagenTrasera}" alt="${product.modelo} - Trasera" class="modal-image">
            <div class="modal-image-indicator">
              <span class="modal-dot active" data-image="0"></span>
              <span class="modal-dot" data-image="1"></span>
            </div>
          </div>
        </div>
        <div class="modal-info">
          <h3>Descripción</h3>
          <p>${product.descripcionCompleta}</p>
          
          <h3>Características</h3>
          <ul>
            ${product.caracteristicas.map(caracteristica => `<li>${caracteristica}</li>`).join('')}
          </ul>
          
          <h3>Tallas Disponibles</h3>
          <div class="size-options">
            ${product.tallas.map(talla => `<span class="size-option">${talla}</span>`).join('')}
          </div>
          
          <h3>Cuidados</h3>
          <p class="care-info">${product.cuidados}</p>
        </div>
      </div>
    </div>
  `;
  
  // Agregar el modal al body
  document.body.appendChild(modal);
  

  
  // Cerrar modal al hacer click en X o fuera del contenido
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Evitar scroll del body cuando el modal está abierto
  document.body.style.overflow = 'hidden';
  
  // Restaurar scroll cuando se cierre el modal
  const originalClose = closeBtn.onclick;
  closeBtn.onclick = () => {
    document.body.style.overflow = 'auto';
    document.body.removeChild(modal);
  };
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.style.overflow = 'auto';
      document.body.removeChild(modal);
    }
  };
}

// Función para manejar transición de imágenes en el modal
function setupModalImageTransition(modal) {
  const images = modal.querySelectorAll('.modal-image');
  const dots = modal.querySelectorAll('.modal-dot');
  let currentIndex = 0;
  let autoTransitionInterval;

  function changeImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function startAutoTransition() {
    autoTransitionInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      changeImage(nextIndex);
    }, 4000);
  }

  function stopAutoTransition() {
    clearInterval(autoTransitionInterval);
  }

  // Event listeners para los puntos indicadores del modal
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      changeImage(index);
      stopAutoTransition();
      startAutoTransition();
    });
  });

  // Iniciar auto-transición
  startAutoTransition();
  
  // Detener transición cuando se cierre el modal
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        for (let node of mutation.removedNodes) {
          if (node === modal) {
            stopAutoTransition();
            observer.disconnect();
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true });
}

filterType.addEventListener("change", renderProducts);
filterSize.addEventListener("change", renderProducts);

// Inicial
renderProducts();
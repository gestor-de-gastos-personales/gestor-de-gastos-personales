
## 1. Definición Inicial del Objetivo Principal
El objetivo es desarrollar un **gestor de gastos personales**. El usuario interactuará con un **bot de WhatsApp** enviando mensajes de texto, imágenes de tickets o facturas en PDF. Mediante el uso de **Inteligencia Artificial (IA)**, el sistema analizará estos datos, extraerá la información relevante y la cargará en una **base de datos**. En paralelo, el usuario dispondrá de una **interfaz web** para visualizar, agregar, modificar o eliminar sus gastos de forma manual.

---

## 2. Determinación de Límites, Alcances y Objetivos

### Límites del Sistema
* **Dentro del alcance:**
  * **Operaciones CRUD:** Agregar, eliminar, mostrar y modificar gastos.
  * **Reportería:** Resumen general de gastos por mes, año y categoría.
  * **Auditoría:** Registro histórico de las acciones realizadas.
* **Fuera del alcance:**
  * **Gestión de ingresos:** No se contemplan entradas de dinero.
  * **IA en la web:** La interfaz web no incluirá el asistente de IA.

### Alcances Funcionales

#### Canal de WhatsApp (Con Agente de IA)
* **Agregar gastos:** Permite enviar mensajes de texto, imágenes o PDFs (transferencias, tickets, facturas).
* **Modificar y eliminar gastos:** Se gestionan mediante mensajes de texto.
* **Consultas:** Mostrar gastos específicos de la base de datos.
* **Búsqueda flexible:** Al eliminar, mostrar o modificar, se puede buscar por **fecha**, **descripción**, **monto** o **ID**.
* **Confirmación de seguridad:** Se requiere confirmación explícita del usuario antes de agregar, eliminar o modificar.

#### Canal Web (Manual, Sin IA)
* **Gestión manual:** Mismas funciones de agregar, eliminar, mostrar y modificar, pero mediante formularios tradicionales.
* **Panel de control:** Visualización completa del **Resumen General**.

### Objetivos Específicos y Medibles
* **Funcionalidad:** Interfaz web completamente operativa antes del **01/10/2026**.
* **Métrica de calidad:** Correcto funcionamiento del flujo CRUD (Agregar, Eliminar, Mostrar, Modificar) y despliegue del Resumen General.
* **Criterio de aceptación:** El sistema debe registrar cada acción con éxito y los gastos deben ser perfectamente visibles en la base de datos y la web.

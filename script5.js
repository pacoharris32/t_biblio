document.addEventListener('DOMContentLoaded', () => {
    const studiesData = []; // Almacena todos los estudios de T_ESTUDIOS.csv
    const acuiferosEstadosData = []; // Almacena la relación acuíferos-estados de T_ACUIFEROS_ESTADOS.csv

    const estadoFilter = document.getElementById('estado-filter');
    const acuiferoFilter = document.getElementById('acuifero-filter');
    const searchInput = document.getElementById('search-input');
    const studiesTableBody = document.querySelector('#studies-table tbody');
    const noResultsMessage = document.getElementById('no-results');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const yearFilter = document.getElementById('year-filter');

    const recordsPerPage = 15;
    let currentPage = 1;
    let filteredAndPaginatedStudies = [];
    const paginationControls = document.getElementById('pagination-controls');

    // Definir los SVGs como cadenas de texto para fácil inserción
    // Puedes ajustar el tamaño (width, height) y el color (fill) si lo necesitas.
    // const SVG_ICON_PDF = `
    //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 5px;">
    //         <path d="M4 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4.707A1 1 0 0 0 11.707 4L8 0.293A1 1 0 0 0 7.293 0z"/>
    //     </svg>`;
    const SVG_ICON_PDF = `
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(105, 28, 50)" class="bi bi-file-pdf-fill" viewBox="0 0 16 16">
  <path d="M5.523 10.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 4.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/>
  <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.6 11.6 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/>
</svg>`;
    // const SVG_ICON_CARATULA = `
    //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 5px;">
    //         <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 0 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
    //         <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
    //     </svg>`;

const SVG_ICON_CARATULA = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(105, 28, 50)"class="bi bi-file-pdf-fill" viewBox="0 0 16 16">
  <path d="M5.523 10.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 4.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/>
  <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.6 11.6 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/>
</svg>`;



    // Función para parsear CSV usando PapaParse (SIN CAMBIOS)
    async function parseCSV(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: No se pudo cargar el archivo ${url}.`);
        }
        const text = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                encoding: 'UTF-8',
                complete: function(results) {
                    const cleanedData = results.data.filter(row =>
                        Object.values(row).some(value => value !== undefined && value !== null && String(value).trim() !== '')
                    );
                    
                    const remappedData = cleanedData.map(item => {
                        if (item['AO'] && !item['ANIO']) {
                            item['ANIO'] = item['AO'];
                            delete item['AO'];
                        }
                        if (item['AÑO'] && !item['ANIO']) {
                            item['ANIO'] = item['AÑO'];
                            delete item['AÑO'];
                        }
                        return item;
                    });
                    
                    resolve(remappedData);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Función para cargar todos los datos iniciales (SIN CAMBIOS)
    async function loadData() {
        try {
            const estudios = await parseCSV('T_ESTUDIOS.csv');
            studiesData.push(...estudios);
            console.log('Datos de Estudios cargados:', studiesData);

            const acuiferos = await parseCSV('T_ACUIFEROS_ESTADOS.csv');
            acuiferosEstadosData.push(...acuiferos);
            console.log('Datos de Acuíferos-Estados cargados:', acuiferosEstadosData);

            populateEstadoFilter();
            populateYearFilter();
            filterStudies();
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            alert(`Hubo un error al cargar los datos: ${error.message}. Por favor, asegúrate de que los archivos CSV estén en la misma carpeta que index.html y que sus cabeceras sean correctas.`);
        }
    }

    // Funciones para poblar filtros (Estado, Acuífero, Año) - SIN CAMBIOS en su lógica central
    function populateEstadoFilter() {
        const estados = new Set(acuiferosEstadosData.map(item => item.ESTADO).filter(Boolean));
        estadoFilter.innerHTML = '<option value="">Todos los Estados</option>';
        Array.from(estados).sort().forEach(estado => {
            const option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            estadoFilter.appendChild(option);
        });
    }

    function populateAcuiferoFilter(selectedEstado) {
        acuiferoFilter.innerHTML = '<option value="">Todos los Acuíferos</option>';
        if (!selectedEstado) {
            acuiferoFilter.disabled = true;
            return;
        }
        acuiferoFilter.disabled = false;
        const acuiferosDelEstado = acuiferosEstadosData.filter(item => item.ESTADO === selectedEstado);
        const acuiferosUnicos = new Set(acuiferosDelEstado.map(item => item.NOM_ACUIF).filter(Boolean));
        Array.from(acuiferosUnicos).sort().forEach(acuifero => {
            const option = document.createElement('option');
            option.value = acuifero;
            option.textContent = acuifero;
            acuiferoFilter.appendChild(option);
        });
    }

    function populateYearFilter(selectedEstado = '') {
        yearFilter.innerHTML = '<option value="">Todos los Años</option>';
        let yearsToPopulate = [];

        if (selectedEstado) {
            const studiesInSelectedStateIds = new Set(
                acuiferosEstadosData
                    .filter(rel => rel.ESTADO === selectedEstado)
                    .map(rel => String(rel.ID_ESTUDIO).trim())
            );
            const yearsForState = studiesData.filter(study => 
                studiesInSelectedStateIds.has(String(study.ID_ESTUDIOS).trim())
            ).map(item => item.ANIO).filter(Boolean);
            yearsToPopulate = Array.from(new Set(yearsForState));
        } else {
            yearsToPopulate = Array.from(new Set(studiesData.map(item => item.ANIO).filter(Boolean)));
        }

        yearsToPopulate.sort((a, b) => b - a).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Función principal para filtrar y mostrar estudios (SIN CAMBIOS)
    function filterStudies() {
        const selectedEstado = estadoFilter.value;
        const selectedAcuifero = acuiferoFilter.value;
        const selectedYear = yearFilter.value;
        const searchText = searchInput.value.toLowerCase();

        let currentFilteredStudies = studiesData.filter(study => {
            const matchingRelations = acuiferosEstadosData.filter(rel => {
                const stateMatch = !selectedEstado || rel.ESTADO === selectedEstado;
                const acuiferoMatch = !selectedAcuifero || rel.NOM_ACUIF === selectedAcuifero;
                return String(rel.ID_ESTUDIO).trim() === String(study.ID_ESTUDIOS).trim() && stateMatch && acuiferoMatch;
            });

            const matchesEstadoAndAcuifero = matchingRelations.length > 0;
            const yearMatch = !selectedYear || String(study.ANIO) === selectedYear; 
            const titleToSearch = (study.TITULO_BUSQUEDA || study.TITULO_ORIGINAL || '').toLowerCase();
            const matchesSearch = !searchText || titleToSearch.includes(searchText);

            return matchesEstadoAndAcuifero && yearMatch && matchesSearch;
        });

        filteredAndPaginatedStudies = currentFilteredStudies;
        currentPage = 1; 
        
        updatePaginationControls();
        renderTable();
    }

    // --- FUNCIÓN renderTable (MODIFICADA para centrar iconos) ---
    function renderTable() {
        studiesTableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const studiesToDisplay = filteredAndPaginatedStudies.slice(startIndex, endIndex);

        if (studiesToDisplay.length === 0) {
            noResultsMessage.classList.remove('hidden');
            paginationControls.innerHTML = ''; 
            paginationControls.style.display = 'none';
            return;
        }
        noResultsMessage.classList.add('hidden');
        paginationControls.style.display = 'flex';

        studiesToDisplay.forEach(study => {
            const row = studiesTableBody.insertRow();
            
            row.insertCell().textContent = study.ID_ESTUDIOS || 'N/D';
            row.insertCell().textContent = study.TITULO_ORIGINAL || 'N/D';
            row.insertCell().textContent = study.ESTADOS || 'N/D'; 
            row.insertCell().textContent = study.ANIO || 'N/D';

            const caratulaCell = row.insertCell();
            if (study.CARATULA && String(study.CARATULA).trim() !== '') {
                const caratulaLink = document.createElement('a');
                caratulaLink.href = String(study.CARATULA).trim();
                caratulaLink.target = '_blank';
                // Añade estilos Flexbox para centrar
                caratulaLink.style.display = 'flex';
                caratulaLink.style.justifyContent = 'center';
                caratulaLink.style.alignItems = 'center';
                caratulaLink.innerHTML = SVG_ICON_CARATULA + ''; // se puede agregar texto como Ver Carátula
                caratulaCell.appendChild(caratulaLink);
            } else {
                caratulaCell.textContent = ''; // Por si no hay documento
            }

            const pdfCell = row.insertCell();
            if (study.PDF && String(study.PDF).trim() !== '') {
                const pdfLink = document.createElement('a');
                pdfLink.href = String(study.PDF).trim();
                pdfLink.target = '_blank';
                // Añade estilos Flexbox para centrar
                pdfLink.style.display = 'flex';
                pdfLink.style.justifyContent = 'center';
                pdfLink.style.alignItems = 'center';
                pdfLink.innerHTML = SVG_ICON_PDF + ''; // se puede agregar texto como Ver PDF
                pdfCell.appendChild(pdfLink);
            } else {
                pdfCell.textContent = '';
            }
        });
    }
    // -------------------------------------------------------------

    // Funciones de paginación y limpiar filtros (SIN CAMBIOS)
    function updatePaginationControls() {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(filteredAndPaginatedStudies.length / recordsPerPage);

        if (totalPages <= 1) {
            paginationControls.style.display = 'none';
            return;
        } else {
            paginationControls.style.display = 'flex';
        }

        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        if (currentPage === 1) {
            prevLi.classList.add('disabled');
        }
        const prevLink = document.createElement('a');
        prevLink.classList.add('page-link');
        prevLink.href = '#';
        prevLink.textContent = 'Anterior';
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                updatePaginationControls();
            }
        });
        prevLi.appendChild(prevLink);
        paginationControls.appendChild(prevLi);

        const maxPagesToShow = 10;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.classList.add('page-item');
            if (i === currentPage) {
                pageLi.classList.add('active');
            }
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderTable();
                updatePaginationControls();
            });
            pageLi.appendChild(pageLink);
            paginationControls.appendChild(pageLi);
        }

        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        if (currentPage === totalPages) {
            nextLi.classList.add('disabled');
        }
        const nextLink = document.createElement('a');
        nextLink.classList.add('page-link');
        nextLink.href = '#';
        nextLink.textContent = 'Siguiente';
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                updatePaginationControls();
            }
        });
        nextLi.appendChild(nextLink);
        paginationControls.appendChild(nextLi);
    }
    
    function clearFilters() {
        estadoFilter.value = '';
        acuiferoFilter.value = '';
        acuiferoFilter.disabled = true;
        yearFilter.value = '';

        populateAcuiferoFilter('');
        populateYearFilter('');
        currentPage = 1;
        filterStudies();
    }

    // Event Listeners (SIN CAMBIOS)
    estadoFilter.addEventListener('change', () => {
        const selectedEstado = estadoFilter.value;
        acuiferoFilter.value = '';
        yearFilter.value = '';
        populateAcuiferoFilter(selectedEstado);
        populateYearFilter(selectedEstado);
        filterStudies();
    });
    acuiferoFilter.addEventListener('change', filterStudies);
    searchInput.addEventListener('input', filterStudies);
    clearFiltersBtn.addEventListener('click', clearFilters);
    yearFilter.addEventListener('change', filterStudies);

    // Cargar datos al inicio
    loadData();
});
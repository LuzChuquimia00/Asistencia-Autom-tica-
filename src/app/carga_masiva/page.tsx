'use client';
import React, { useState, useMemo, useCallback } from 'react';
import './masiva.css'; // Estilos específicos para la tabla y scroll
// Tipado para un registro de preceptor procesado
interface PreceptorRecord {
    nombre: string;
    apellido: string;
    grado: string;
    username: string;
    password: string;
    status: 'VÁLIDO' | 'ERROR' | 'PENDIENTE';
    message: string;
}

// Tipado para el estado del modal
interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'info' | 'success';
}

// === Componente Principal de la Aplicación ===
const App: React.FC = () => {
    // 1. Estado de la aplicación
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Carga, 2: Resultados, 3: Confirmación
    const [file, setFile] = useState<File | null>(null);
    const [processedData, setProcessedData] = useState<PreceptorRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', message: '', type: 'info' });

    const REQUIRED_FIELDS = 3;

    // Funciones para manejar el Modal (reemplazo de alert())
    const showModal = useCallback((title: string, message: string, type: 'error' | 'info' | 'success' = 'info') => {
        setModal({ isOpen: true, title, message, type });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    // 2. Lógica de CSV Parsing y Validación
    const parseCSV = useCallback((csvText: string): PreceptorRecord[] => {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) {
            throw new Error("El archivo está vacío o solo contiene la cabecera.");
        }

        const results: PreceptorRecord[] = [];
        
        // La validación de cabecera es sencilla, solo asumimos el orden: nombre,apellido,grado
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple split por coma. Se podría mejorar con una librería para manejo de comillas/saltos de línea.
            const cols = line.split(',').map(c => c.trim());
            
            let record: PreceptorRecord = {
                nombre: cols[0] || '',
                apellido: cols[1] || '',
                grado: cols[2] || '',
                username: '',
                password: '',
                status: 'PENDIENTE',
                message: ''
            };
            
            // Criterio de Aceptación: Debe haber 3 campos y no deben estar vacíos
            if (cols.length < REQUIRED_FIELDS) {
                record.status = 'ERROR';
                record.message = `Faltan campos (esperado: ${REQUIRED_FIELDS}, encontrado: ${cols.length}).`;
            } else if (!record.nombre || !record.apellido || !record.grado) {
                record.status = 'ERROR';
                record.message = 'Verifica que no tengas algún campo vacío.';
            } else {
                // Limpieza de nombre y apellido para credenciales
                const cleanName = record.nombre.replace(/\s/g, '').toLowerCase();   
                const cleanLastName = record.apellido.replace(/\s/g, '').toLowerCase();
 
                // GENERACIÓN AUTOMÁTICA DE USERNAME
                record.username = `${cleanName}_${cleanLastName}`;
                
                // GENERACIÓN AUTOMÁTICA DE PASSWORD
                record.password = cleanName + cleanLastName;
 
                record.status = 'VÁLIDO';
                record.message = 'Listo para registrar.';
            }
            
            results.push(record);
        }
        return results;
    }, [REQUIRED_FIELDS]);

    // 3. Manejo de la carga y procesamiento del archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Criterio de Aceptación: Solo acepta archivos CSV
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                showModal('Error de Formato', 'Solo se aceptan archivos con extensión <code class="font-mono">.csv</code>.', 'error');
                setFile(null);
                e.target.value = ''; // Limpiar input
                return;
            }
            setFile(selectedFile);
        }
    };

    const processFile = () => {
        if (!file) {
            showModal('Error de Archivo', 'Por favor, selecciona un archivo CSV para continuar.', 'error');
            return;
        }

        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target?.result as string;
                const data = parseCSV(csvText);
                setProcessedData(data);
                
                // Criterio de Aceptación: Tras cargar el archivo, debe darse a conocer los resultados
                setStep(2);
            } catch (error) {
                showModal('Error de Procesamiento', `Ocurrió un error: ${(error as Error).message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setIsLoading(false);
            showModal('Error de Lectura', 'No se pudo leer el archivo.', 'error');
        };
        reader.readAsText(file);
    };

    // 4. Lógica de Confirmación y PocketBase
    const simulatePocketBaseSubmission = (dataToSend: PreceptorRecord[]) => {
        // Criterio de Aceptación: Tras aceptar los datos registrados, estos se deben enviar a pocketbase.
        console.log("--- SIMULACIÓN DE ENVÍO A POCKETBASE (LÓGICA REAL AQUÍ) ---");
        console.log(`Se enviarán ${dataToSend.length} registros válidos.`);
        
        const finalPayload = dataToSend.map(record => ({
            name: record.nombre,
            lastName: record.apellido,
            gradeLevel: record.grado,
            username: record.username, // Usuario generado
            password: record.password, // Contraseña generada
            passwordConfirm: record.password, // Requerido por PocketBase
            role: 'preceptor'
        }));
        
        console.log("Payload simulado enviado a PocketBase:");
        console.log(finalPayload);
        // Aquí iría el fetch o el uso del SDK de PocketBase
    };

    const confirmAndSubmit = () => {
        const validRecords = processedData.filter(r => r.status === 'VÁLIDO');
        
        if (validRecords.length === 0) {
            showModal('No hay Datos Válidos', 'No hay registros válidos para enviar a la base de datos.', 'error');
            return;
        }

        simulatePocketBaseSubmission(validRecords); 
        setStep(3);
    };

    const resetApp = () => {
        setStep(1);
        setFile(null);
        setProcessedData([]);
        setIsLoading(false);
        // Nota: Si el input de tipo file no se limpia, se puede limpiar con una referencia (ref) si fuera necesario.
    };
    
    // 5. Cálculos derivados para el Resumen
    const { validCount, errorCount } = useMemo(() => {
        const valid = processedData.filter(r => r.status === 'VÁLIDO').length;
        const error = processedData.filter(r => r.status === 'ERROR').length;
        return { validCount: valid, errorCount: error };
    }, [processedData]);

    // 6. Componentes de UI por paso
    
    // --- UI: Paso 1 (Carga de Archivo) ---
    const Step1Upload = (
        <section className="border-b pb-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Paso 1: Cargar Archivo CSV</h2>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <input 
                    type="file" 
                    id="csvFileInput" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                    // ESTILO TAILWIND
                    className="flex-grow w-full sm:w-auto text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 rounded-lg p-2 border border-gray-300"
                />
                
                <button 
                    onClick={processFile} 
                    disabled={!file || isLoading}
                    // ESTILO TAILWIND
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {isLoading ? 'Procesando...' : 'Procesar Archivo'}
                </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
                <span className="font-bold">Criterios:</span> Solo archivos CSV. Campos requeridos: <code className="bg-gray-100 p-1 rounded">nombre</code>, <code className="bg-gray-100 p-1 rounded">apellido</code>, <code className="bg-gray-100 p-1 rounded">grado</code>.
            </p>
        </section>
    );

    // --- UI: Paso 2 (Resultados y Confirmación) ---
    const Step2Results = (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Paso 2: Resultados del Procesamiento</h2>
            
            {/* Resumen */}
            <div className={`mb-4 p-4 rounded-xl shadow-md border-l-4 ${errorCount > 0 ? 'bg-red-50 border-red-500 text-red-800' : 'bg-green-50 border-green-500 text-green-800'}`}>
                <p><span className="font-bold">Total de Registros:</span> {processedData.length}</p>
                <p><span className="font-bold">Registros Válidos:</span> <span className="text-emerald-600 font-semibold">{validCount}</span></p>
                <p><span className="font-bold">Registros con Error:</span> <span className="text-red-600 font-semibold">{errorCount}</span></p>
                {errorCount > 0 && <p className="mt-2 text-sm font-medium">Solo los registros VÁLIDOS serán enviados a PocketBase.</p>}
            </div>

            {/* Tabla de Resultados (Usa la clase 'scroll-container' definida en masiva.css) */}
            <div className="scroll-container overflow-x-auto rounded-xl shadow-xl border border-gray-200 max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            {['#', 'Nombre', 'Apellido', 'Grado','Usuario (Auto)' ,'Contraseña (Auto)', 'Estado', 'Mensaje'].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processedData.map((record, index) => {
                            const isError = record.status === 'ERROR';
                            const rowColor = isError ? 'bg-red-50/50 hover:bg-red-100' : 'bg-white hover:bg-gray-50';
                            const statusClass = isError ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold';

                            return (
                                <tr key={index} className={rowColor}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.nombre}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.apellido}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.grado}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{record.username || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{record.password || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={statusClass}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{record.message}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Botón de Confirmación */}
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={confirmAndSubmit} 
                    disabled={validCount === 0}
                    // ESTILO TAILWIND
                    className="px-8 py-3 bg-emerald-600 text-white font-bold text-lg rounded-full hover:bg-emerald-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                    Aceptar y Enviar a PocketBase ({validCount} Registros)
                </button>
            </div>
        </section>
    );

    // --- UI: Paso 3 (Confirmación Final) ---
    const Step3Confirmation = (
        <section>
            <div className="p-8 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-xl shadow-lg flex items-start space-x-4">
                <svg className="w-8 h-8 flex-shrink-0 mt-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h2 className="text-2xl font-bold">¡Proceso Completado Exitosamente!</h2>
                    <p className="mt-2 text-lg">Los {validCount} registros válidos han sido enviados a PocketBase para su almacenamiento.</p>
                    <button 
                        onClick={resetApp} 
                        className="mt-4 px-6 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition shadow-md"
                    >
                        Cargar otro archivo
                    </button>
                </div>
            </div>
        </section>
    );

    // --- Renderizado principal ---
    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-50">
            
            <header className="w-full max-w-4xl mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Registro Masivo de Preceptores</h1>
                <p className="text-lg text-gray-600">Proceso de carga de usuarios mediante archivo CSV.</p>
            </header>

            <main className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-2xl shadow-2xl space-y-8">
                {step === 1 && Step1Upload}
                {step === 2 && Step2Results}
                {step === 3 && Step3Confirmation}
            </main>

            {/* Modal de Errores/Mensajes (Usa clases Tailwind para el diseño) */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-transform scale-100">
                        <h3 className={`text-xl font-bold mb-4 ${modal.type === 'error' ? 'text-red-600' : 'text-indigo-600'}`}>{modal.title}</h3>
                        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: modal.message }}></p>
                        <button onClick={closeModal} className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition shadow-md">
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

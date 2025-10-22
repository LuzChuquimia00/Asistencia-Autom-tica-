// Definimos las propiedades que Next.js pasará al componente
type Props = {
    params: {
        courseId: string; // 'courseId' debe coincidir con el nombre de la carpeta [courseId]
    };
};

// El componente recibe 'params' para acceder al valor de la URL
const CourseDetailPage = ({ params }: Props) => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Detalles de la Asistencia</h1>
            <p style={{ fontSize: '1.2rem' }}>
                Mostrando la planilla para el curso: 
                <strong style={{ marginLeft: '0.5rem', color: '#0F193E' }}>
                    {decodeURIComponent(params.courseId)}
                </strong>
            </p>
            {/* Aquí es donde construiremos la tabla de alumnos en el siguiente paso */}
        </div>
    );
};

export default CourseDetailPage;
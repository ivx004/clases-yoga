import { useState, useEffect } from 'react'

function DatosAPI() {
  const [clases, setClases] = useState([])
  const [estado, setEstado] = useState('cargando') // 'cargando', 'exito', 'error'
  const [error, setError] = useState('')

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    setEstado('cargando')
    setError('')
    
    try {
      // API en tu servidor local
      const API_URL = 'http://127.0.0.1:8000/api/clases'
      
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const datos = await response.json()
      setClases(datos.clases || [])
      setEstado('exito')
    } catch (err) {
      setError(err.message)
      setEstado('error')
      console.error('Error al cargar API:', err)
    }
  }

  return (
    <div>
      <h2>🔌 Datos de la API - Clases Disponibles</h2>
      
      <div className={`api-status ${estado}`}>
        {estado === 'cargando' && '⏳ Cargando clases...'}
        {estado === 'exito' && `✅ ${clases.length} clases obtenidas correctamente`}
        {estado === 'error' && `❌ Error al obtener datos: ${error}`}
      </div>

      <button onClick={cargarClases} style={{ marginBottom: '20px' }}>
        🔄 Recargar datos
      </button>

      {estado === 'exito' && clases.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {clases.map(clase => (
            <div key={clase.id} className="clase-card" style={{ border: '2px solid #667eea' }}>
              <div className="clase-header">
                <h3>{clase.nombre}</h3>
                <span className={`badge ${clase.disponible ? 'activa' : 'inactiva'}`}>
                  {clase.disponible ? '🟢 Disponible' : '⚪ No disponible'}
                </span>
              </div>
              
              <div className="clase-body">
                <img 
                  src={clase.imagen} 
                  alt={clase.nombre}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                />
                <p>
                  <strong>Descripción:</strong> {clase.descripcion}
                </p>
                <p>
                  <strong>Categoría:</strong> {clase.categoria}
                </p>
                <p>
                  <strong>Precio:</strong> ${clase.precio.toLocaleString('es-CL')}
                </p>
                <p>
                  <strong>ID:</strong> #{clase.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {estado === 'exito' && clases.length === 0 && (
        <div className="empty-state">
          <p>📭 No hay clases disponibles</p>
        </div>
      )}

      {estado === 'error' && (
        <div className="mensaje error">
          <strong>❌ No se pudo conectar a la API</strong>
          <p>Verifica que:</p>
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>La API esté corriendo en <code>http://127.0.0.1:8000</code></li>
            <li>Ejecutaste: <code>uvicorn main:app --host 0.0.0.0 --port 8000</code></li>
            <li>Tengas conexión a internet</li>
          </ul>
          <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
            Error: {error}
          </p>
        </div>
      )}

      {estado === 'cargando' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
          <p>Conectando con la API...</p>
        </div>
      )}
    </div>
  )
}

export default DatosAPI

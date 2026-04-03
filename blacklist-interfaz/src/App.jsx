import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState('RESTRICCIONES');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nuevos Estados para la lógica de Nuevo/Eliminar
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    documento: '', nombre: '', ip: '', referencia: '', motivoBloqueo: ''
  });

  const fetchTableData = async () => {
    setLoading(true);
    setSelectedRowId(null); // Limpiar selección al recargar
    try {
      let endpoint = selectedType === 'LISTA BLANCA' 
        ? 'http://localhost:8081/api/v1/whitelist' 
        : 'http://localhost:8081/api/v1/blacklist';
      const response = await axios.get(endpoint);
      setTableData(response.data);
    } catch (error) {
      console.error(`Error obteniendo datos:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [selectedType]);

  // Manejador para el formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para GUARDAR (Nuevo)
  const handleSave = async () => {
    try {
      const isWhitelist = selectedType === 'LISTA BLANCA';
      const endpoint = isWhitelist 
        ? 'http://localhost:8081/api/v1/whitelist' 
        : 'http://localhost:8081/api/v1/blacklist';

      const today = new Date();
      const payload = {
        fechaRegistro: today.toISOString().split('T')[0],
        documento: formData.documento,
        nombre: formData.nombre,
        ip: formData.ip,
        ...(isWhitelist ? {
          usuarioRegistro: 'BFDLP09112' // Usuario logueado simulado
        } : {
          referencia: formData.referencia || '0',
          horaBloqueo: today.toTimeString().split(' ')[0],
          motivoBloqueo: formData.motivoBloqueo || 'Ingreso manual'
        })
      };

      await axios.post(endpoint, payload);
      setShowAddModal(false);
      setFormData({ documento: '', nombre: '', ip: '', referencia: '', motivoBloqueo: '' }); // Limpiar
      fetchTableData(); // Recargar tabla
      alert("Registro guardado exitosamente.");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el registro.");
    }
  };

  // Función para ELIMINAR
  const handleDelete = async () => {
    if (!selectedRowId) {
      alert("Por favor, seleccione un registro de la tabla primero.");
      return;
    }

    const confirmDelete = window.confirm("¿Está seguro que desea eliminar este registro?");
    if (confirmDelete) {
      try {
        const endpoint = selectedType === 'LISTA BLANCA' 
          ? `http://localhost:8081/api/v1/whitelist/${selectedRowId}` 
          : `http://localhost:8081/api/v1/blacklist/${selectedRowId}`;

        await axios.delete(endpoint);
        fetchTableData(); // Recargar tabla tras eliminar
        alert("Registro eliminado.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el registro.");
      }
    }
  };

  return (
    <div className="system-wrapper">
      <header className="top-header">
        <div className="logo">e IBS</div>
        <div className="system-title">Sistema Bancario Integrado</div>
      </header>

      <div className="main-layout">
        <aside className="left-panel">
          <div className="user-panel">
            <div>11:26:29 AM | 18/11/25</div>
            <div>Usuario: BFDLP09112</div>
            <div>Oficina: 91</div>
          </div>
          <nav className="side-nav">
             {/* ... Tu menú (mantenlo igual) ... */}
             <ul className="nav-menu">
              <li>Gestión de Monitoreo
                <ul className="sub-menu">
                  <li className="active-submenu">Lista Anti Fraude</li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 className="content-title">
            {selectedType === 'LISTA BLANCA' ? 'Lista Blanca' : 'Lista Anti Fraude'}
          </h1>

          <div className="toolbar">
            {/* BOTÓN NUEVO */}
            <div className="toolbar-icon" onClick={() => setShowAddModal(true)} style={{cursor: 'pointer'}}>
              <div className="icon-placeholder">N</div>
              <span>Nuevo</span>
            </div>
            
            <div className="toolbar-icon" onClick={fetchTableData} style={{cursor: 'pointer'}}>
              <div className="icon-placeholder">C</div>
              <span>Consultar</span>
            </div>
            
            <div className="toolbar-controls">
              <div className="type-selector">
                <label>Tipo :</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="SELECCIONE">SELECCIONE TIPO...</option>
                  <option value="RESTRICCIONES">LISTA ANTI-FRAUDE</option>
                  <option value="LISTA BLANCA">LISTA EXCEPCIONES</option>
                </select>
              </div>
              <div className="search-box">
                <label>Búsqueda Rápida : </label>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {/* BOTÓN ELIMINAR */}
            <div className="toolbar-icon" onClick={handleDelete} style={{cursor: 'pointer'}}>
              <div className="icon-placeholder">E</div>
              <span>Eliminar</span>
            </div>
            <div className="toolbar-icon">
              <div className="icon-placeholder">X</div>
              <span>Salir</span>
            </div>
          </div>

          <div className="table-container">
            <table className="anti-fraude-table">
              <thead>
                {selectedType === 'LISTA BLANCA' ? (
                  <tr>
                    <th></th><th>FECHA REGISTRO</th><th>CÉDULA / RIF</th><th>NOMBRE</th><th>DIRECCIÓN IP</th><th>USUARIO REGISTRO</th>
                  </tr>
                ) : (
                  <tr>
                    <th></th><th>FECHA REGISTRO</th><th>CÉDULA / RIF</th><th>DIRECCIÓN IP</th><th>REFERENCIA</th><th>HORA DE BLOQUEO</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '10px'}}>Cargando...</td></tr>
                ) : tableData.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '10px'}}>No hay registros</td></tr>
                ) : (
                  tableData.map((row) => (
                    <tr key={row.id} className={selectedRowId === row.id ? 'selected-row' : ''}>
                      {/* VINCULAR RADIO BUTTON AL ESTADO */}
                      <td className="center-cell">
                        <input 
                          type="radio" 
                          name="select-row" 
                          checked={selectedRowId === row.id}
                          onChange={() => setSelectedRowId(row.id)} 
                        />
                      </td>
                      <td>{row.fechaRegistro}</td>
                      <td>{row.documento}</td>
                      {selectedType === 'LISTA BLANCA' ? (
                        <><td>{row.nombre}</td><td>{row.ip}</td><td>{row.usuarioRegistro}</td></>
                      ) : (
                        <><td>{row.ip}</td><td>{row.referencia}</td><td>{row.horaBloqueo}</td></>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL LEGACY PARA "NUEVO" */}
      {showAddModal && (
        <div className="legacy-modal-overlay">
          <div className="legacy-modal-window">
            <div className="legacy-modal-header">
              <span>Agregar Nuevo Registro - {selectedType}</span>
              <button onClick={() => setShowAddModal(false)}>X</button>
            </div>
            <div className="legacy-modal-body">
              <div className="legacy-form-group">
                <label>Cédula / RIF:</label>
                <input type="text" name="documento" value={formData.documento} onChange={handleInputChange} />
              </div>
              <div className="legacy-form-group">
                <label>Nombre Cliente:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
              </div>
              <div className="legacy-form-group">
                <label>Dirección IP:</label>
                <input type="text" name="ip" value={formData.ip} onChange={handleInputChange} placeholder="Ej: 192.168.1.1" />
              </div>

              {/* Campos específicos de Lista Negra */}
              {selectedType !== 'LISTA BLANCA' && (
                <>
                  <div className="legacy-form-group">
                    <label>Referencia:</label>
                    <input type="text" name="referencia" value={formData.referencia} onChange={handleInputChange} />
                  </div>
                  <div className="legacy-form-group">
                    <label>Motivo:</label>
                    <input type="text" name="motivoBloqueo" value={formData.motivoBloqueo} onChange={handleInputChange} />
                  </div>
                </>
              )}
            </div>
            <div className="legacy-modal-footer">
              <button className="legacy-btn" onClick={handleSave}>Guardar</button>
              <button className="legacy-btn" onClick={() => setShowAddModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
import { useState } from "react";
import axios from "axios";

export default function PagoMovil() {
  const [showModal, setShowModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    tipo: "Personas",
    banco: "0151 - BFC Banco Fondo Común",
    cedulaTipo: "V",
    cedula: "",
    telefono: "",
    monto: "",
    concepto: ""
  });

  const API_URL = "http://localhost:8081/api/v1/not";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generadores automáticos
  const generarCodigo = () => "PM-" + Math.floor(100000 + Math.random() * 900000);
  const generarFecha = () => new Date().toISOString().split("T")[0];
  const generarHora = () => new Date().toTimeString().split(" ")[0];

  // Validación mínima
  const formIsValid =
    form.cedula &&
    form.telefono &&
    form.monto &&
    form.concepto;

  const generarReferenciaAleatoria = () => {
    const numeroAleatorio = Math.floor(Math.random() * 10000000000); 
    return String(numeroAleatorio).padStart(10, '0');
};

const [referencia, setReferencia] = useState(generarReferenciaAleatoria());

  // Envío al backend
  const handleSubmit = async () => {
    try {
      const payload = {
        codigo: generarCodigo(),
        fecha: generarFecha(),
        hora: generarHora(),
        codigoMoneda: "VES",
        monto: form.monto,
        tipo: form.cedulaTipo === "J"  ? "P2C" : "P2P",
        referenciaBancoOrigen: referencia,
        bancoOrigen: "0151",
        bancoDestino: form.banco.split(" ")[0],
        numCliente: form.telefono,
        cuentaOrigen: "01510100803000885044",
        cuentaDestino: "01510100803412341234",
        idComercio: "1",
        concepto: form.concepto,
        cedulaOrigen: "V12345678",
        cedulaDestino: form.cedulaTipo + form.cedula
      };

      console.log("Enviando payload:", payload);

      const response = await axios.post(API_URL, payload);

      setReceiptData({
        monto: form.monto,
        // Formatear fecha estilo "29/03/2026 05:51 PM"
        fecha: new Date().toLocaleString('es-VE', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', hour12: true 
        }).toUpperCase(),
        comprobante: payload.referenciaBancoOrigen,
        beneficiario: "Beneficiario",
        cuenta: response.data.cuentaDestino || "0151123412341234",
        telefono: form.telefono,
        cedula: `${form.cedulaTipo}-${form.cedula}`,
        banco: form.banco.split(" - ")[1] || form.banco,
        concepto: form.concepto
      });

      setShowModal(true);

    } catch (err) {
      console.error(err);
      
      if (err.response && err.response.status === 403) {
        // Rechazo por lista negra o monto
        setErrorMessage("Transacción rechazada"); 
        // Nota: Si quieres mostrar el motivo exacto del backend, podrías usar: 
        // setErrorMessage(err.response.data.message);
      } else {
        // Otro error genérico
        setErrorMessage("Error de conexión al procesar el pago");
      }

      setShowErrorModal(true);
    }
  };

  return (
    <div className="w-full flex justify-center p-8 bg-[#f8f9fb] min-h-screen">
      <div className="w-full max-w-5xl bg-white shadow-sm rounded-2xl p-10 border border-[#e7e9ef]">
        <h1 className="text-center text-2xl font-semibold text-[#0037c1] mb-8">Pago Móvil</h1>

        {/* CUENTA */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Cuenta</label>
          <select className="w-full p-3 border rounded-lg bg-white">
            <option>0151********5044 - CTA. CORRIENTE CON INTERESES - Bs.</option>
          </select>
          <p className="text-xs text-gray-600 mt-2">Saldo disponible: Bs. 12.426,47</p>
          <p className="text-xs text-gray-600">Saldo respaldo: 0,00</p>
        </div>

        {/* TIPO */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            <option>Personas</option>
            <option>Comercios</option>
          </select>
        </div>

        {/* BANCOS */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Bancos</label>
          <select name="banco" value={form.banco} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            <option>0151 - BFC Banco Fondo Común</option>
            <option>0102 - Banco de Venezuela</option>
            <option>0105 - Mercantil</option>
            <option>0134 - Banesco</option>
          </select>
        </div>

        {/* CEDULA + TELEFONO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Cédula de Identidad / RIF</label>
            <select name="cedulaTipo" value={form.cedulaTipo} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white mb-2">
              <option>V</option>
              <option>E</option>
              <option>J</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Número de Cédula</label>
            <input name="cedula" value={form.cedula} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número de Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" />
          </div>
        </div>

        {/* MONTO + CONCEPTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <input name="monto" value={form.monto} onChange={handleChange} placeholder="Bs. 0,00" className="w-full p-3 border rounded-lg border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Concepto</label>
            <input name="concepto" value={form.concepto} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" />
            <p className="text-xs text-gray-500 text-right mt-1">(Comentario de uso personal) 0 / 50</p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-2 rounded-lg border border-[#0037c1] text-[#0037c1] hover:bg-blue-50 transition"
            onClick={() =>
              setForm({
                tipo: "Personas",
                banco: "0151 - BFC Banco Fondo Común",
                cedulaTipo: "V",
                cedula: "",
                telefono: "",
                monto: "",
                concepto: ""
              })
            }
          >
            Limpiar
          </button>

          <button
            className={`px-6 py-2 rounded-lg text-white transition ${
              formIsValid ? "bg-[#0037c1] hover:bg-blue-800" : "bg-gray-300"
            }`}
            disabled={!formIsValid}
            onClick={handleSubmit}
          >
            Aceptar
          </button>
        </div>
      </div>

      {/* --- MODAL DEL COMPROBANTE --- */}
      {showModal && receiptData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-[420px] rounded-3xl p-6 shadow-2xl relative">
            
            {/* Título */}
            <h2 className="text-center text-xl font-semibold text-[#0037c1] mb-6">
              Realizaste un Pago Móvil de Bs. {receiptData.monto}
            </h2>

            {/* Tarjeta de Datos Gris/Azul claro */}
            <div className="bg-[#f2f4fa] rounded-2xl p-5 mb-5 space-y-3 text-[14px]">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Fecha:</span>
                <span className="text-gray-600">{receiptData.fecha}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Comprobante:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{receiptData.comprobante}</span>
                  {/* Icono de Copiar */}
                  <button className="text-gray-800 hover:text-blue-600 transition" title="Copiar comprobante">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Beneficiario:</span>
                <span className="text-gray-600">{receiptData.beneficiario}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Cuenta a Debitar:</span>
                <span className="text-gray-600 font-mono text-xs">{receiptData.cuenta}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Número de Teléfono:</span>
                <span className="text-gray-600">{receiptData.telefono}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Cédula de Identidad / RIF:</span>
                <span className="text-gray-600">{receiptData.cedula}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Banco:</span>
                <span className="text-gray-600">{receiptData.banco}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-gray-800">Concepto:</span>
                <span className="text-gray-600">{receiptData.concepto}</span>
              </div>
            </div>

            {/* Banner de Éxito */}
            <div className="bg-[#f2f4fa] rounded-xl py-3 text-center font-semibold text-gray-800 text-[15px] mb-8">
              Tu Pago Móvil fue Exitoso
            </div>

            {/* Checkmark Circular Azul */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full border-[5px] border-[#0037c1] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0037c1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            {/* Botón para cerrar (Opcional, pero recomendado para UX) */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

          </div>
        </div>
      )}

      {/* --- MODAL DE ERROR (RECHAZO) --- */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#f0f0f5] w-full max-w-[400px] min-h-[180px] rounded-[2rem] p-6 relative flex items-center justify-center shadow-2xl">
            
            {/* Botón de cerrar (Circular gris) */}
            <button 
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 bg-[#d1d1d6] hover:bg-[#c7c7cc] text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Texto del error */}
            <p className="text-center text-[19px] text-[#3a3a3c] font-medium px-4 mt-2">
              {errorMessage}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

import axios from "axios";

const API_URL = "http://localhost:8080/pago-movil"; // Ajusta tu endpoint real

const generarCodigo = () => "PM-" + Math.floor(Math.random() * 100000);
const generarFecha = () => new Date().toISOString().split("T")[0];
const generarHora = () => new Date().toTimeString().split(" ")[0];

const handleSubmit = async () => {
  try {
    const payload = {
      codigo: generarCodigo(),
      fecha: generarFecha(),
      hora: generarHora(),
      codigoMoneda: "VES",
      monto: monto,                     // viene del input
      tipo: "PAGO_MOVIL",
      referenciaBancoOrigen: "REF123456",
      bancoOrigen: bancoOrigen,         // viene del input
      bancoDestino: bancoDestino,       // viene del input
      numCliente: telefono,             // viene del input
      cuentaOrigen: cuentaOrigen ?? "0134123412341234",
      cuentaDestino: cuentaDestino ?? "0134123412341234",
      idComercio: "COM001",
      concepto: concepto ?? "Pago por servicio"
    };

    const response = await axios.post(API_URL, payload);
    console.log("Respuesta backend:", response.data);

    alert("Pago móvil enviado correctamente 🎉");

  } catch (error) {
    console.error("Error enviando pago móvil", error);
    alert("Error al enviar el pago móvil");
  }
};

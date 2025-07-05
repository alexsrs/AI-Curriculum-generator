export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Teste do Tailwind CSS
        </h1>
        <p className="text-gray-600">
          Se você conseguir ver esta página com cores e estilos, 
          o Tailwind CSS está funcionando corretamente!
        </p>
        <div className="mt-4 flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Botão Azul
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Botão Verde
          </button>
        </div>
      </div>
    </div>
  )
}

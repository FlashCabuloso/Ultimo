// netlify/functions/updateStatus.js
exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { status } = JSON.parse(event.body);
        // Aqui você pode adicionar a lógica para lidar com o status
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Status atualizado com sucesso!' }),
        };
    }
    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método não permitido' }),
    };
};

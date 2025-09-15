module.exports = async function (context, req) {
    context.log('Processando requisição de validação de CPF');

    const cpf = req.query.cpf || (req.body && req.body.cpf);

    if (!cpf) {
        context.res = {
            status: 400,
            body: { error: "CPF não fornecido" }
        };
        return;
    }

    const isValid = validateCPF(cpf);

    context.res = {
        status: 200,
        body: { cpf: cpf, valido: isValid }
    };
};

// Função de validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

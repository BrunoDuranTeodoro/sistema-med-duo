const API_CONSULTAS = "http://localhost:8089/consultas";
const API_PACIENTES = "http://localhost:8089/pacientes";
const API_MEDICOS = "http://localhost:8089/medicos";

document.addEventListener("DOMContentLoaded", () => {
    carregarPacientesSelect();
    carregarMedicosSelect();
    listarConsultas();
});

// Função utilitária para mostrar notificações Toast
function mostrarNotificacao(texto, tipo = "success") {
    Toastify({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: tipo === "success" ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
    }).showToast();
}

// Função para gerenciar estado de loading no botão
function setButtonLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (isLoading) {
        btn.dataset.originalText = btn.innerText;
        btn.innerHTML = 'Processando... <div class="spinner"></div>';
        btn.disabled = true;
    } else {
        btn.innerText = btn.dataset.originalText || "Enviar";
        btn.disabled = false;
    }
}

// --- CARREGAR SELECT DE PACIENTES ---
async function carregarPacientesSelect() {
    try {
        const response = await fetch(API_PACIENTES);
        const data = await response.json();
        const select = document.getElementById("selectPaciente");
        select.innerHTML = '<option value="">Selecione um paciente...</option>';
        
        if (data.content) {
            data.content.forEach((p) => {
                const option = document.createElement("option");
                option.value = p.id;
                option.text = `${p.nome} (CPF: ${p.cpf})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        mostrarNotificacao("Erro ao carregar pacientes", "error");
    }
}

// --- CARREGAR SELECT DE MÉDICOS ---
async function carregarMedicosSelect() {
    try {
        const response = await fetch(API_MEDICOS);
        const data = await response.json();
        const select = document.getElementById("selectMedico");
        select.innerHTML = '<option value="">Selecione um médico (ou aleatório)...</option>';

        if (data.content) {
            data.content.forEach((m) => {
                const option = document.createElement("option");
                option.value = m.id;
                option.text = `${m.nome} - ${m.especialidade}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
         mostrarNotificacao("Erro ao carregar médicos", "error");
    }
}

// --- LISTAR CONSULTAS ---
async function listarConsultas() {
    try {
        const response = await fetch(API_CONSULTAS);
        const data = await response.json();
        const tbody = document.querySelector("#tabelaConsultas tbody");
        tbody.innerHTML = "";

        if (data.content && data.content.length > 0) {
            data.content.forEach((c) => {
                const dataFormatada = new Date(c.data).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' });
                
                let statusBadge = `<span style="color: green; font-weight: bold;">Agendada</span>`;
                let classeRow = "";

                if (c.motivoCancelamento) {
                    statusBadge = `<span style="color: red;">Cancelada (${c.motivoCancelamento})</span>`;
                    classeRow = "status-cancelado"; // Definido no CSS original
                }

                const tr = document.createElement("tr");
                if (classeRow) tr.classList.add(classeRow);

                tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.medico}</td>
            <td>${c.paciente}</td>
            <td>${dataFormatada}</td>
            <td>${statusBadge}</td>
        `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma consulta encontrada.</td></tr>';
        }
    } catch (error) {
        console.error("Erro consultas:", error);
    }
}

// --- AGENDAR CONSULTA (POST) ---
document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById("resultAgendamento");
    resultDiv.style.display = "none";
    
    const btnSubmit = e.target.querySelector("button[type='submit']");
    const btnId = btnSubmit.id || "btnAgendarSubmit"; // Garanta que o botão no HTML tenha ID ou use seletor
    btnSubmit.id = btnId; 

    setButtonLoading(btnId, true);

    const idPaciente = document.getElementById("selectPaciente").value;
    const idMedico = document.getElementById("selectMedico").value;
    const dataHora = document.getElementById("data").value;

    const payload = { idPaciente: idPaciente, data: dataHora };
    if (idMedico) payload.idMedico = idMedico;

    try {
        const response = await fetch(API_CONSULTAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (response.ok) {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Consulta agendada com sucesso.',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            document.getElementById("formAgendamento").reset();
            listarConsultas();
        } else {
            let msg = "Erro desconhecido";
            if (data) {
                 if (Array.isArray(data)) msg = data.map(e => e.mensagem).join("\n");
                 else if (data.message) msg = data.message;
            }
            throw new Error(msg);
        }
    } catch (error) {
        Swal.fire({
            title: 'Erro!',
            html: error.message.replace(/\n/g, "<br>"), // Quebra de linha no SweetAlert
            icon: 'error',
            confirmButtonText: 'Fechar'
        });
    } finally {
        setButtonLoading(btnId, false);
    }
});

// --- CANCELAR CONSULTA (DELETE) ---
document.getElementById("formCancelamento").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Confirmação antes de enviar
    const confirmacao = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, cancelar!',
        cancelButtonText: 'Voltar'
    });

    if (!confirmacao.isConfirmed) return;

    const idConsulta = document.getElementById("idConsulta").value;
    const motivo = document.getElementById("motivo").value;

    const payload = {
        idConsulta: idConsulta,
        motivo: motivo,
    };

    try {
        const response = await fetch(API_CONSULTAS, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        
        // Verifica status 204 (No Content)
        if (response.status === 204) {
             mostrarNotificacao("Consulta cancelada com sucesso!");
             listarConsultas();
             document.getElementById("formCancelamento").reset();
        } else {
            const data = await response.json().catch(() => null);
            let msg = data && data.message ? data.message : "Erro ao cancelar.";
            throw new Error(msg);
        }
    } catch (error) {
        Swal.fire('Erro!', error.message, 'error');
    }
});
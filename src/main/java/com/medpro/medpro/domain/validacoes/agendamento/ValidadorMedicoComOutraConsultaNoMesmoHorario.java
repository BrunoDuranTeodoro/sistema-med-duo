package com.medpro.medpro.domain.validacoes.agendamento;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.medpro.medpro.infra.execption.ValidacaoException;
import com.medpro.medpro.model.dto.DadosAgendamentoConsulta;
import com.medpro.medpro.repository.ConsultaRepository;

@Component
public class ValidadorMedicoComOutraConsultaNoMesmoHorario implements ValidadorAgendamentoDeConsulta {

    @Autowired
    private ConsultaRepository repository;

    public void validar(DadosAgendamentoConsulta dados) {
        // Define o intervalo de conflito (1 hora antes e 1 hora depois do horário desejado)
        // Isso garante que se houver uma consulta às 10:00, não se pode marcar às 10:00, 
        // e a query no repository cuida dos intervalos (start < data < end).
        var horarioInicioConflict = dados.data().minusHours(1);
        var horarioFimConflict = dados.data().plusHours(1);

        // O método existsByMedicoIdAndData_consultaAndStatus NÃO existia e o nome do campo estava errado.
        // O método correto no Repository é existsByMedicoIdAndDataConflict
        var medicoPossuiOutraConsultaNoMesmoHorario = repository.existsByMedicoIdAndDataConflict(
                dados.idMedico(),
                horarioInicioConflict,
                horarioFimConflict
        );

        if (medicoPossuiOutraConsultaNoMesmoHorario) {
            throw new ValidacaoException("Médico já possui outra consulta agendada nesse mesmo horário");
        }
    }
}
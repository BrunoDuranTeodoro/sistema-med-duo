package com.medpro.medpro.domain.validacoes.agendamento;

import java.time.DayOfWeek;

import org.springframework.stereotype.Component;

import com.medpro.medpro.infra.exeption.ValidacaoException;
import com.medpro.medpro.model.dto.DadosAgendamentoConsulta;

@Component
public class ValidadorHorarioFuncionamento implements ValidadorAgendamentoDeConsulta {
    public void validar(DadosAgendamentoConsulta dados) {
        var dataConsulta = dados.data();
        var domingo = dataConsulta.getDayOfWeek().equals(DayOfWeek.SUNDAY);
        var antesDaAbertura = dataConsulta.getHour() < 7;
        var depoisDoFechamento = dataConsulta.getHour() > 18;
        if (domingo || antesDaAbertura || depoisDoFechamento) {
            throw new ValidacaoException("Consulta fora do horário de funcionamento da clínica");
        }
    }
}

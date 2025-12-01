package com.medpro.medpro.domain.validacoes.agendamento;
import com.medpro.medpro.model.dto.DadosAgendamentoConsulta;

public interface ValidadorAgendamentoDeConsulta {
    void validar(DadosAgendamentoConsulta dados);
}
package com.medpro.medpro.model.dto;

import java.time.LocalDateTime;

import com.medpro.medpro.enums.Especialidade;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record DadosAgendamentoConsulta(
    Long idMedico,

    @NotNull
    Long idPaciente,

    @NotNull
    @Future // Garante que a data é futura
    LocalDateTime data,

    Especialidade especialidade
) {
}
package com.medpro.medpro.model.dto;

import jakarta.validation.constraints.NotNull;

public record DadosCancelamentoConsulta(
    @NotNull
    Long idConsulta,

    @NotNull
    String motivo
) {
}
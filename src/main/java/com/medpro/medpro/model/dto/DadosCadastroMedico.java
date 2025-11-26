package com.medpro.medpro.model.dto;

import com.medpro.medpro.enums.Especialidade;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
//RECORD entra como um dto mais moderno e menos verboso, onde os atributos precisam ser passador nos parametros.
//aqui a especialidade e um enum e o endereço um class record embarcada 
public record DadosCadastroMedico(
    @NotBlank String nome,
    @NotBlank String email,
    @NotBlank String telefone,
    @NotBlank @Pattern(regexp = "\\d{4,6}" ) String crm, 
    @NotNull Especialidade especialidade,
    @NotNull @Valid DadosEndereco endereco ) {

} 

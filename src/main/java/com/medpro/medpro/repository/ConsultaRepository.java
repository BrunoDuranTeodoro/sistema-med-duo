package com.medpro.medpro.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medpro.medpro.model.entity.Consulta;
import com.medpro.medpro.model.entity.StatusConsulta;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    Boolean existsByMedicoIdAndData_consultaAndStatus(Long idMedico, LocalDateTime data, StatusConsulta status);

    Boolean existsByPacienteIdAndData_consultaBetweenAndStatus(Long idPaciente, LocalDateTime primeiroHorario, LocalDateTime ultimoHorario, StatusConsulta status);
}
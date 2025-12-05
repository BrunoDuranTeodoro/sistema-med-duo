package com.medpro.medpro.controller;

import com.medpro.medpro.domain.consulta.AgendaDeConsultas;
import com.medpro.medpro.model.dto.DadosAgendamentoConsulta;
import com.medpro.medpro.model.dto.DadosCancelamentoConsulta;
import com.medpro.medpro.model.dto.DadosDetalhamentoConsulta;
import com.medpro.medpro.model.dto.DadosListagemConsulta;
import com.medpro.medpro.repository.ConsultaRepository; // Apenas para listagem simples (opcional mover para service também)
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("consultas")
public class ConsultaController {

    @Autowired
    private AgendaDeConsultas agenda;
    
    @Autowired
    private ConsultaRepository consultaRepository; // Usado apenas para leitura (CQRS simplificado)

    @PostMapping
    @Transactional
    public ResponseEntity detalhar(@RequestBody @Valid DadosAgendamentoConsulta dados) {
        var dto = agenda.agendar(dados);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity cancelar(@RequestBody @Valid DadosCancelamentoConsulta dados) {
        agenda.cancelar(dados);
        return ResponseEntity.noContent().build();
    }
    
    // Leitura simples pode permanecer aqui ou ir para uma classe de ConsultaService
    @GetMapping
    public ResponseEntity<Page<DadosListagemConsulta>> listar(
            @PageableDefault(size = 10, sort = { "data" }) Pageable paginacao) {
        var page = consultaRepository.findAll(paginacao).map(DadosListagemConsulta::new);
        return ResponseEntity.ok(page);
    }
}
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
from datetime import datetime
from collections import defaultdict

def main():
    # Dicionário para agrupar as datas por pet_id dentro de cada perfil
    # A chave será o pet_profile (ex: "Cão;Golden Retriever;Longo")
    # O valor será outro dicionário: {pet_id: [datas]}
    pet_dates_by_profile = defaultdict(lambda: defaultdict(list))
    current_profile = None
    
    # Processa a entrada linha por linha
    for line in sys.stdin:
        line = line.strip()
        
        # Tenta dividir a linha em chave (profile) e valor (pet_id,date)
        try:
            profile, value = line.split('\t', 1)
            pet_id, date_str = value.split(',', 1)
        except ValueError:
            # Ignora linhas mal formatadas
            continue

        # Converte a string de data para um objeto datetime
        try:
            # O formato pode ter milissegundos (.0)
            date_obj = datetime.strptime(date_str.split('.')[0], '%Y-%m-%d %H:%M:%S')
        except ValueError:
            continue

        # Se o perfil mudou, processa o perfil anterior
        if current_profile and current_profile != profile:
            process_profile(current_profile, pet_dates_by_profile[current_profile])
            # Limpa o dicionário para o próximo perfil
            pet_dates_by_profile.pop(current_profile)

        current_profile = profile
        pet_dates_by_profile[current_profile][pet_id].append(date_obj)

    # Processa o último perfil
    if current_profile:
        process_profile(current_profile, pet_dates_by_profile[current_profile])

def process_profile(profile, pet_dates):
    """
    Calcula a frequência média para um perfil de pet.
    """
    average_frequencies = []
    
    # Itera sobre cada pet dentro do perfil
    for pet_id, dates in pet_dates.items():
        # Precisa de pelo menos 2 datas para calcular a diferença
        if len(dates) < 2:
            continue
        
        # Ordena as datas
        dates.sort()
        
        # Calcula a diferença em dias entre agendamentos consecutivos
        diffs = []
        for i in range(len(dates) - 1):
            time_diff = dates[i+1] - dates[i]
            diffs.append(time_diff.days)
        
        # Calcula a frequência média para este pet
        if diffs:
            avg_freq = sum(diffs) / len(diffs)
            average_frequencies.append(avg_freq)
            
    # Calcula a média geral das frequências médias de todos os pets no perfil
    if average_frequencies:
        final_average = sum(average_frequencies) / len(average_frequencies)
        # Emite o resultado final: perfil e a frequência média em dias (arredondado)
        print('%s\t%d' % (profile, int(round(final_average))))

if __name__ == "__main__":
    main()

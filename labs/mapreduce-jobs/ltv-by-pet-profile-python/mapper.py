#!/usr/bin/env python3

import sys

for line in sys.stdin:
    line = line.strip()
    # Format from Sqoop: Cão;Longo,123.45
    # After schema change: species;fur_type,purchase_value
    fields = line.split(',')
    if len(fields) == 2:
        pet_profile = fields[0]
        purchase_value = fields[1]
        print(f"{pet_profile}\t{purchase_value}")

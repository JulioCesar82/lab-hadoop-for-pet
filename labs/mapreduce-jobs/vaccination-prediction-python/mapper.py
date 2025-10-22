#!/usr/bin/env python3

import sys

for line in sys.stdin:
    line = line.strip()
    # Input format from Sqoop (example):
    # vaccination_record_id, pet_id, pet_name, species, application_date, vaccine_name, booster_interval_months, mandatory
    fields = line.split(',')
    if len(fields) >= 8:
        pet_id = fields[1] # pet_id
        application_date = fields[4].strip() # application_date
        vaccine_name = fields[5].strip() # vaccine_name
        booster_interval_months = fields[6].strip() # booster_interval_months
        mandatory = fields[7].strip() # mandatory
        
        # Emit pet_id as key and relevant vaccine data as value
        print(f"{pet_id}\t{application_date},{booster_interval_months},{vaccine_name},{mandatory}")

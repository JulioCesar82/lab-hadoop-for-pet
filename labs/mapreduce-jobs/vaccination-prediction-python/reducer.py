#!/usr/bin/env python3

import sys
from datetime import datetime, timedelta

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue

    try:
        pet_id, vaccine_data_str = line.split('\t', 1)
        application_date_str, booster_interval_months_str, vaccine_name, mandatory_str = vaccine_data_str.split(',', 3)

        application_date = datetime.strptime(application_date_str, "%Y-%m-%d %H:%M:%S.%f")
        booster_interval_months = float(booster_interval_months_str)
        mandatory = mandatory_str.lower() == 'true'

        next_dose_date = None
        is_overdue = False
        
        if booster_interval_months > 0:
            # Calculate next dose date by adding months to application_date
            # Approximate days in a month for timedelta calculation
            next_dose_date = application_date + timedelta(days=int(booster_interval_months * 30.4375))
            
            if next_dose_date.date() < datetime.now().date():
                is_overdue = True
        
        next_dose_date_formatted = next_dose_date.strftime('%Y-%m-%d') if next_dose_date else "N/A"
        
        print(f"{pet_id}\t{vaccine_name},{next_dose_date_formatted},{is_overdue},{mandatory}")

    except ValueError as e:
        sys.stderr.write(f"Skipping malformed input: {line} - Error: {e}\n")
    except Exception as e:
        sys.stderr.write(f"An unexpected error occurred: {e} on line: {line}\n")

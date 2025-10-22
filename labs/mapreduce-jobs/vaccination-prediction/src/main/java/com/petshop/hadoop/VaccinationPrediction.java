package com.petshop.hadoop;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class VaccinationPrediction extends Configured implements Tool {

    private static final Log LOG = LogFactory.getLog(VaccinationPrediction.class);

    // Mapper: Emite (pet_id, application_date, booster_interval_months, vaccine_name, mandatory)
    public static class PredictionMapper extends Mapper<Object, Text, Text, Text> {
        private Text petId = new Text();
        private Text vaccineData = new Text();
        private SimpleDateFormat inputDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // Adjust if Sqoop output format is different

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // Input format from Sqoop (example):
            // 1,1,Bidu,Cão,2025-04-10 14:00:00.0,Banho e Tosa Completa,12,true
            // Assuming a joined input: vaccination_record_id, pet_id, pet_name, species, application_date, vaccine_name, booster_interval_months, mandatory
            String[] fields = value.toString().split(",");
            if (fields.length >= 8) { // Ensure enough fields for joined data
                petId.set(fields[1]); // pet_id
                
                // Extract relevant fields for reducer
                String applicationDate = fields[4].trim(); // application_date
                String vaccineName = fields[5].trim(); // vaccine_name
                String boosterIntervalMonths = fields[6].trim(); // booster_interval_months
                String mandatory = fields[7].trim(); // mandatory

                vaccineData.set(applicationDate + "," + boosterIntervalMonths + "," + vaccineName + "," + mandatory);
                context.write(petId, vaccineData);
            } else {
                LOG.warn("Linha mal formatada ignorada: '" + value.toString() + "'");
            }
        }
    }

    // Reducer: Calcula a próxima dose e identifica vacinas vencidas
    public static class PredictionReducer extends Reducer<Text, Text, Text, Text> {
        private Text result = new Text();
        private SimpleDateFormat inputDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S"); // Adjust for milliseconds
        private SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            Date today = new Date(); // Current date for comparison

            for (Text val : values) {
                String[] parts = val.toString().split(",");
                if (parts.length == 4) {
                    try {
                        String applicationDateStr = parts[0];
                        float boosterIntervalMonths = Float.parseFloat(parts[1]);
                        String vaccineName = parts[2];
                        boolean mandatory = Boolean.parseBoolean(parts[3]);

                        Date applicationDate = inputDateFormat.parse(applicationDateStr);

                        Date nextDoseDate = null;
                        boolean isOverdue = false;

                        if (boosterIntervalMonths > 0) {
                            Calendar cal = Calendar.getInstance();
                            cal.setTime(applicationDate);
                            cal.add(Calendar.MONTH, (int) boosterIntervalMonths);
                            nextDoseDate = cal.getTime();

                            if (nextDoseDate.before(today)) {
                                isOverdue = true;
                            }
                        }

                        String nextDoseDateFormatted = (nextDoseDate != null) ? outputDateFormat.format(nextDoseDate) : "N/A";
                        
                        result.set(vaccineName + "," + nextDoseDateFormatted + "," + isOverdue + "," + mandatory);
                        context.write(key, result);

                    } catch (ParseException | NumberFormatException e) {
                        LOG.warn("Erro ao parsear dados para pet_id " + key.toString() + ": " + val.toString(), e);
                    }
                } else {
                    LOG.warn("Dados de vacina mal formatados para pet_id " + key.toString() + ": " + val.toString());
                }
            }
        }
    }

    @Override
    public int run(String[] args) throws Exception {
        if (args.length != 2) {
            System.err.println("Uso: VaccinationPrediction <input path> <output path>");
            return -1;
        }

        Configuration conf = getConf();
        Job job = Job.getInstance(conf, "Vaccination Prediction");
        job.setJarByClass(VaccinationPrediction.class);
        job.setMapperClass(PredictionMapper.class);
        job.setReducerClass(PredictionReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        return job.waitForCompletion(true) ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        int res = ToolRunner.run(new Configuration(), new VaccinationPrediction(), args);
        System.exit(res);
    }
}

package com.petshop.hadoop;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class FrequencyRecommendation {

    // Mapper: Emite (pet_id, data_agendamento)
    public static class FrequencyMapper extends Mapper<Object, Text, Text, Text> {
        private Text petId = new Text();
        private Text appointmentDate = new Text();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // Formato da linha do Sqoop: 1,Bidu,2025-04-10 14:00:00.0
            String[] fields = value.toString().split(",");
            if (fields.length >= 3) {
                petId.set(fields[0]);
                appointmentDate.set(fields[2].trim());
                context.write(petId, appointmentDate);
            }
        }
    }

    // Reducer: Calcula a frequência e a data sugerida
    public static class FrequencyReducer extends Reducer<Text, Text, Text, Text> {
        private Text result = new Text();
        private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            List<Date> dates = new ArrayList<>();
            for (Text val : values) {
                try {
                    dates.add(dateFormat.parse(val.toString()));
                } catch (ParseException e) {
                    // Ignora datas mal formatadas
                }
            }

            // Precisa de pelo menos 2 datas para calcular a frequência
            if (dates.size() < 2) {
                return;
            }

            // 1. Ordena as datas
            Collections.sort(dates);

            // 2. Calcula as diferenças em dias
            List<Long> diffs = new ArrayList<>();
            for (int i = 0; i < dates.size() - 1; i++) {
                long diffInMillis = dates.get(i + 1).getTime() - dates.get(i).getTime();
                diffs.add(TimeUnit.DAYS.convert(diffInMillis, TimeUnit.MILLISECONDS));
            }

            // 3. Calcula a frequência média
            long sumOfDiffs = 0;
            for (Long diff : diffs) {
                sumOfDiffs += diff;
            }
            long averageFrequencyDays = sumOfDiffs / diffs.size();

            // 4. Calcula a data sugerida
            Date lastAppointment = dates.get(dates.size() - 1);
            long suggestedDateMillis = lastAppointment.getTime() + TimeUnit.MILLISECONDS.convert(averageFrequencyDays, TimeUnit.DAYS);
            Date suggestedDate = new Date(suggestedDateMillis);
            
            // Formata a data sugerida para yyyy-MM-dd
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
            String suggestedDateStr = outputFormat.format(suggestedDate);

            // 5. Emite o resultado
            result.set(suggestedDateStr + "," + averageFrequencyDays);
            context.write(key, result);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Frequency Recommendation");
        job.setJarByClass(FrequencyRecommendation.class);
        job.setMapperClass(FrequencyMapper.class);
        job.setCombinerClass(FrequencyReducer.class); // Pode usar o mesmo Reducer como Combiner
        job.setReducerClass(FrequencyReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}

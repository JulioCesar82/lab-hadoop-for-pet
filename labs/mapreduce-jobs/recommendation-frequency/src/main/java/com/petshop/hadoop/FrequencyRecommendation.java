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
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class FrequencyRecommendation extends Configured implements Tool {

    private static final Log LOG = LogFactory.getLog(FrequencyRecommendation.class);

    // Mapper: Emite (pet_id, data_agendamento)
    public static class FrequencyMapper extends Mapper<Object, Text, Text, Text> {
        private static final Log LOG = LogFactory.getLog(FrequencyMapper.class);
        private Text petId = new Text();
        private Text appointmentDate = new Text();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            LOG.debug("Processando linha de entrada: '" + value.toString() + "'");
            // Formato da linha do Sqoop: 1,Bidu,2025-04-10 14:00:00.0
            String[] fields = value.toString().split(",");
            if (fields.length >= 3) {
                petId.set(fields[0]);
                appointmentDate.set(fields[2].trim());
                context.write(petId, appointmentDate);
                LOG.debug("Emitindo -> Chave: " + petId.toString() + ", Valor: " + appointmentDate.toString());
            } else {
                LOG.warn("Linha mal formatada ignorada (menos de 3 campos): '" + value.toString() + "'");
            }
        }
    }

    // Reducer: Calcula a frequência e a data sugerida
    public static class FrequencyReducer extends Reducer<Text, Text, Text, Text> {
        private static final Log LOG = LogFactory.getLog(FrequencyReducer.class);
        private Text result = new Text();
        private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            LOG.info("Iniciando Reducer para a chave: " + key.toString());

            List<Date> dates = new ArrayList<>();
            for (Text val : values) {
                try {
                    dates.add(dateFormat.parse(val.toString()));
                } catch (ParseException e) {
                    LOG.warn("Não foi possível parsear a data para a chave " + key.toString() + ". Valor: '" + val.toString() + "'", e);
                }
            }
            LOG.debug("Chave " + key.toString() + " possui " + dates.size() + " agendamentos válidos.");

            // Precisa de pelo menos 2 datas para calcular a frequência
            if (dates.size() < 2) {
                LOG.warn("Ignorando chave " + key.toString() + " por ter menos de 2 registros de data (" + dates.size() + ").");
                return;
            }

            // 1. Ordena as datas
            Collections.sort(dates);
            LOG.debug("Datas ordenadas para " + key.toString() + ": " + dates.toString());

            // 2. Calcula as diferenças em dias
            List<Long> diffs = new ArrayList<>();
            for (int i = 0; i < dates.size() - 1; i++) {
                long diffInMillis = dates.get(i + 1).getTime() - dates.get(i).getTime();
                diffs.add(TimeUnit.DAYS.convert(diffInMillis, TimeUnit.MILLISECONDS));
            }
            LOG.debug("Diferenças em dias para " + key.toString() + ": " + diffs.toString());

            // 3. Calcula a frequência média
            long sumOfDiffs = 0;
            for (Long diff : diffs) {
                sumOfDiffs += diff;
            }
            long averageFrequencyDays = sumOfDiffs / diffs.size();
            LOG.debug("Frequência média calculada para " + key.toString() + ": " + averageFrequencyDays + " dias.");

            // 4. Calcula a data sugerida a partir da data mais recente (último agendamento ou data atual)
            Date lastAppointment = dates.get(dates.size() - 1);
            Date now = new Date(); // Pega a data e hora atuais da execução

            // Define a data base para o cálculo: será o último agendamento ou a data atual, o que for mais recente.
            // Isso garante que a sugestão seja sempre no futuro.
            Date baseDate = lastAppointment.after(now) ? lastAppointment : now;

            long suggestedDateMillis = baseDate.getTime() + TimeUnit.MILLISECONDS.convert(averageFrequencyDays, TimeUnit.DAYS);
            Date suggestedDate = new Date(suggestedDateMillis);

            // Formata a data sugerida para yyyy-MM-dd
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
            String suggestedDateStr = outputFormat.format(suggestedDate);
            LOG.debug("Data base para cálculo: " + dateFormat.format(baseDate) + ". Data sugerida: " + suggestedDateStr);

            // 5. Emite o resultado
            result.set(suggestedDateStr + "," + averageFrequencyDays);
            context.write(key, result);
            LOG.info("Resultado final para " + key.toString() + " -> Chave: " + key.toString() + ", Valor: " + result.toString());
        }
    }

    @Override
    public int run(String[] args) throws Exception {
        LOG.info("Iniciando o job FrequencyRecommendation...");
        if (args.length != 2) {
            LOG.error("Uso: FrequencyRecommendation <input path> <output path>");
            System.err.println("Usage: FrequencyRecommendation <input path> <output path>");
            return -1;
        }
        
        String inputPath = args[0];
        String outputPath = args[1];
        LOG.info("Caminho de entrada: " + inputPath);
        LOG.info("Caminho de saída: " + outputPath);

        Configuration conf = getConf();
        Job job = Job.getInstance(conf, "Frequency Recommendation");
        job.setJarByClass(FrequencyRecommendation.class);
        job.setMapperClass(FrequencyMapper.class);
        // job.setCombinerClass(FrequencyReducer.class);
        job.setReducerClass(FrequencyReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(inputPath));
        FileOutputFormat.setOutputPath(job, new Path(outputPath));

        boolean success = job.waitForCompletion(true);
        if (success) {
            LOG.info("Job concluído com sucesso!");
        } else {
            LOG.error("O Job falhou.");
        }
        return success ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        int res = ToolRunner.run(new Configuration(), new FrequencyRecommendation(), args);
        System.exit(res);
    }
}
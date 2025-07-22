package com.petshop.hadoop;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

public class LTVCalculation {

    // Mapper: Emite (perfil_pet, valor_compra)
    public static class LTVMapper extends Mapper<Object, Text, Text, DoubleWritable> {
        private Text petProfile = new Text();
        private DoubleWritable purchaseValue = new DoubleWritable();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // Formato da linha do Sqoop: Cão;Longo,123.45
            String[] fields = value.toString().split(",");
            if (fields.length == 2) {
                try {
                    petProfile.set(fields[0]);
                    purchaseValue.set(Double.parseDouble(fields[1]));
                    context.write(petProfile, purchaseValue);
                } catch (NumberFormatException e) {
                    // Ignora linhas com valor de compra mal formatado
                }
            }
        }
    }

    // Reducer: Soma os valores por perfil
    public static class LTVReducer extends Reducer<Text, DoubleWritable, Text, DoubleWritable> {
        private DoubleWritable result = new DoubleWritable();

        public void reduce(Text key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {
            double sum = 0;
            for (DoubleWritable val : values) {
                sum += val.get();
            }
            result.set(sum);
            context.write(key, result);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "LTV by Pet Profile");
        job.setJarByClass(LTVCalculation.class);
        job.setMapperClass(LTVMapper.class);
        job.setCombinerClass(LTVReducer.class);
        job.setReducerClass(LTVReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(DoubleWritable.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}

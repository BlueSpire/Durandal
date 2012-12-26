namespace Optimizer {
    using CommandLine;

    class Program {
        static void Main(string[] args) {
            var options = new Options();
            if(CommandLineParser.Default.ParseArguments(args, options)) {
                
            }
        }
    }
}
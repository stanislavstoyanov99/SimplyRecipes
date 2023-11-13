namespace SimplyRecipes.Services.Data.Tests
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    public class Configuration
    {
        public IConfigurationRoot ConfigurationRoot { get; private set; }

        public Configuration()
        {
            var serviceCollection = new ServiceCollection();

            this.ConfigurationRoot = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile(
                    path: "appsettings.tests.json",
                    optional: false,
                    reloadOnChange: true)
                .AddJsonFile(
                    path: "appsettings.tests.Development.json",
                    optional: false,
                    reloadOnChange: true)
                .Build();

            serviceCollection.AddSingleton(this.ConfigurationRoot);
        }
    }
}
